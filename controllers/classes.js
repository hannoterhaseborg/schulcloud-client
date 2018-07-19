const _ = require('lodash');
const express = require('express');
const router = express.Router();
const marked = require('marked');
const api = require('../api');
const authHelper = require('../helpers/authentication');
const recurringEventsHelper = require('../helpers/recurringEvents');
const moment = require('moment');

const getSelectOptions = (req, service, query, values = []) => {
    return api(req).get('/' + service, {
        qs: query
    }).then(data => {
        return data.data;
    });
};

/**
 * sets undefined array-class properties to an empty array
 */
const mapEmptyClassProps = (req, res, next) => {
    let classBody = req.body;
    if (!classBody.teacherIds) classBody.teacherIds = [];
    if (!classBody.userIds) classBody.userIds = [];
    next();
};

// secure routes
router.use(authHelper.authChecker);


/*
 * Classes
 */


router.get('/', function (req, res, next) {
    api(req).get('/classes/', {
        qs: {
            $or: [
                {userIds: res.locals.currentUser._id},
                {teacherIds: res.locals.currentUser._id}
            ]
        }
    }).then(classes => {

        const teachersPromise = getSelectOptions(req, 'users', {roles: ['teacher', 'demoTeacher'], $limit: 1000});
        const studentsPromise = getSelectOptions(req, 'users', {roles: ['student', 'demoStudent'], $limit: 1000});

        Promise.all([
            teachersPromise,
            studentsPromise
        ]).then(([teachers, students]) => {

            // preselect current teacher when creating new class
            teachers.forEach(t => {
                if (JSON.stringify(t._id) === JSON.stringify(res.locals.currentUser._id)) t.selected = true;
            });

            res.render('classes/overview', {
                title: 'Meine Klassen',
                classes,
                teachers,
                students
            });
        });
    });
});

const schoolyears = ["2018/2019", "2019/2020"]
const renderClassCreate = (req, res, next, edit) => {
    api(req).get('/classes/')
    .then(classes => {
        let promises = [
            getSelectOptions(req, 'users', {roles: ['teacher', 'demoTeacher'], $limit: 1000}), //teachers
            getSelectOptions(req, 'users', {roles: ['student', 'demoStudent'], $limit: 1000})  //students
        ]
        if(edit){promises.push(api(req).get(`/classes/${req.params.classId}`));}

        Promise.all(promises).then(([teachers, students, currentClass]) => {
            const isAdmin = res.locals.currentUser.permissions.includes("ADMIN_VIEW")
            if(isAdmin){
                // preselect current teacher when creating new class and the current user isn't a admin (teacher)
                teachers.forEach(t => {
                    if (JSON.stringify(t._id) === JSON.stringify(res.locals.currentUser._id)) t.selected = true;
                });
            }
            if(currentClass){
                // preselect already selected teachers
                teachers.forEach(t => {
                    if(currentClass.teacherIds.includes(t._id)){t.selected = true;}
                });

                // TODO - remove these mocks
                currentClass.grade = '9';
                currentClass.classsuffix = "b";
                currentClass.keepYear = true;
                currentClass.customName = "blaBlu";
            }

            res.render('classes/create', {
                title: `Klasse ${edit?"bearbeiten":"erstellen"}`,
                edit,
                schoolyears: schoolyears,
                teachers,
                class: currentClass,
                isCustom: true // TODO - implement detection or ask api
            });
        });
    });
}

router.get('/create', function (req, res, next) {
    renderClassCreate(req,res,next,false);
});
router.get('/:classId/edit', function (req, res, next) {
    renderClassCreate(req,res,next,true);
})

router.get('/:classId/manage', function (req, res, next) {
    api(req).get('/classes/' + req.params.classId, { qs: { $populate: ['teacherIds', 'substitutionIds', 'userIds']}})
    .then(currentClass => {
        const classes = getSelectOptions(req, 'classes', {_id: {$ne: currentClass._id}, $limit: 1000});
        const teachersPromise = getSelectOptions(req, 'users', {roles: ['teacher', 'demoTeacher'], $limit: 1000});
        const studentsPromise = getSelectOptions(req, 'users', {roles: ['student', 'demoStudent'], $limit: 1000});

        Promise.all([
            classes,
            teachersPromise,
            studentsPromise
        ]).then(([classes, teachers, students]) => {

            // deep copy
            let substitutions = JSON.parse(JSON.stringify(teachers));
            // preselect current teacher when creating new class
            if((currentClass.teacherIds||[]).length == 0){
                teachers.forEach(t => {
                    if (JSON.stringify(t._id) === JSON.stringify(res.locals.currentUser._id)){
                        t.selected = true;
                    }
                });
            }else{
                const teacherIds = currentClass.teacherIds.map(t => {return t._id;});
                substitutions = substitutions.filter(t => {return !teacherIds.includes(t._id);});
                teachers.forEach(t => {
                    if(teacherIds.includes(t._id)){
                        t.selected = true;
                    }
                });
            }
            res.render('classes/edit', {
                title: 'Klasse bearbeiten',
                schoolyears: ["2018/2019", "2019/2020"],
                "class": currentClass,
                classes,
                teachers,
                substitutions: substitutions,
                students,
                invitationLink: 'schul-cloud.org/1234Eckstein'
            });
        });
    });
});

router.post('/create', function (req, res, next) {
    if(!req.body.keepyear){
        delete req.body.schoolyear;
    }
    api(req).post('/classes/', {
        // TODO: sanitize
        json: req.body
    }).then(data => {
        res.redirect(`/classes/${data._id}`);
    }).catch(err => {
        next(err);
    });
});


router.get('/:classId/', function (req, res, next) {
    api(req).get('/classes/' + req.params.classId)
    .then(data => res.json(data))
    .catch(err => {
        next(err);
    });
});

router.patch('/:classId/', mapEmptyClassProps, function (req, res, next) {
    api(req).patch('/classes/' + req.params.classId, {
        // TODO: sanitize
        json: req.body
    }).then(data => {
        res.redirect(req.header('Referer'));
    }).catch(err => {
        next(err);
    });
});

router.delete('/:classId/', function (req, res, next) {
    api(req).delete('/classes/' + req.params.classId).then(_ => {
        res.sendStatus(200);
    }).catch(_ => {
        res.sendStatus(500);
    });
});


router.get('/currentTeacher/', function (req, res, next) {
    res.json(res.locals.currentUser._id);
});
module.exports = router;
