const _ = require('lodash');
const moment = require('moment');
const express = require('express');
const router = express.Router({ mergeParams: true });
const marked = require('marked');
const api = require('../api');
const authHelper = require('../helpers/authentication');
const ltiCustomer = require('../helpers/ltiCustomer');
const request = require('request');

const createToolHandler = (req, res, next) => {
    const context = req.originalUrl.split('/')[1];
    api(req).post('/ltiTools/', {
        json: req.body
    }).then((tool) => {
        if (tool._id) {
            api(req).patch(`/${context}/` + req.body.courseId, {
                json: {
                    $push: {
                        ltiToolIds: tool._id
                    }
                }
			}).then((course) => {
				res.redirect(`/${context}/${course._id}/tools/`);
			});
        }
    });
};

const addToolHandler = (req, res, next) => {
    const context = req.originalUrl.split('/')[1];
    let action = `/${context}/` + req.params.courseId + '/tools/add';

    api(req).get('/ltiTools', { qs: {isTemplate: true}})
    .then(tools => {
        api(req).get(`/${context}/` + req.params.courseId)
            .then(course => {
                res.render('courses/add-tool', {
                    action,
                    title: 'Tool anlegen für ' + course.name,
                    submitLabel: 'Tool anlegen',
                    ltiTools: tools.data,
                    courseId: req.params.courseId
                });
            });
    });
};

const runToolHandler = (req, res, next) => {
    let currentUser = res.locals.currentUser;
    Promise.all([
    api(req).get('/ltiTools/' + req.params.ltiToolId),
    api(req).get('/roles/' + currentUser.roles[0]._id),
    api(req).get('/pseudonym?userId=' + currentUser._id + '&toolId=' + req.params.ltiToolId)
    ]).then(([tool, role, pseudonym]) => {
       let customer = new ltiCustomer.LTICustomer();
       let consumer = customer.createConsumer(tool.key, tool.secret);
       let user_id = '';
       if (tool.privacy_permission === 'pseudonymous') {
         user_id = pseudonym.data[0].pseudonym;
       } else if (tool.privacy_permission === 'name' || tool.privacy_permission === 'e-mail') {
         user_id = currentUser._id;
       }
       let payload = {
           lti_version: tool.lti_version,
           lti_message_type: tool.lti_message_type,
           resource_link_id: tool.resource_link_id || req.params.courseId,
           roles: customer.mapSchulcloudRoleToLTIRole(role.name),
           launch_presentation_document_target: 'window',
           launch_presentation_locale: 'en',
           lis_person_name_full: (tool.privacy_permission === 'name'
             ? currentUser.displayName || `${currentUser.firstName} ${currentUser.lastName}`
             : ''),
           lis_person_contact_email_primary: (tool.privacy_permission === 'e-mail'
             ? currentUser.email
             : ''),
           user_id
       };
       tool.customs.forEach((custom) => {
           payload[customer.customFieldToString(custom)] = custom.value;
       });

       let request_data = {
           url: tool.url,
           method: 'POST',
           data: payload
       };

        var formData = consumer.authorize(request_data);

        res.render('courses/components/run-lti-frame', {
            url: tool.url,
            method: 'POST',
            formData: Object.keys(formData).map(key => {
                return {name: key, value: formData[key]};
            })
        });
    });
};

const getDetailHandler = (req, res, next) => {
    const context = req.originalUrl.split('/')[1];
    Promise.all([
        api(req).get(`/${context}/`, {
        qs: {
            teacherIds: res.locals.currentUser._id}
        }),
        api(req).get('/ltiTools/' + req.params.id)]).
    then(([courses, tool]) => {
        res.json({
            tool: tool
        });
    }).catch(err => {
        next(err);
    });
};

const showToolHandler = (req, res, next) => {
    const context = req.originalUrl.split('/')[1];

    Promise.all([
        api(req).get('/ltiTools/' + req.params.ltiToolId),
        api(req).get(`/${context}/` + req.params.courseId)
    ])
    .then(([tool, course]) => {
        let renderPath = tool.isLocal ? 'courses/run-tool-local' : 'courses/run-lti';
        res.render(renderPath, {
            course: course,
            title: `${tool.name}, Kurs/Fach: ${course.name}`,
            tool: tool
        });
    });
};


// secure routes
router.use(authHelper.authChecker);

router.get('/', (req, res, next) => {
    const context = req.originalUrl.split('/')[1];
    res.redirect(`/${context}/` + req.params.courseId + '/tools/');
});

router.get('/add', addToolHandler);
router.post('/add', createToolHandler);

router.get('/run/:ltiToolId', runToolHandler);
router.get('/show/:ltiToolId', showToolHandler);

router.get('/:id', getDetailHandler);

router.delete('/delete/:ltiToolId', function (req, res, next) {
	const context = req.originalUrl.split('/')[1];
    api(req).patch(`/${context}/` + req.params.courseId, {
        json: {
            $pull: {
                ltiToolIds: req.params.ltiToolId
            }
        }
    }).then(_ => {
        api(req).delete('/ltiTools/' + req.params.ltiToolId).then(_ => {
            res.sendStatus(200);
        });
    });
});

module.exports = router;