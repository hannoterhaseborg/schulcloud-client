/*
 * One Controller per layout view
 */


const url = require('url');
const express = require('express');
const router = express.Router();
const api = require('../api');
const authHelper = require('../helpers/authentication');
const _subjects = require('../helpers/content/subjects.json');
const _ = require('lodash');
const subjects = _.mapValues(_subjects, v => ({name: v}));

// secure routes
router.use(authHelper.authChecker);

router.get('/:id', function (req, res, next) {
    Promise.all([
        api(req).get('/courses/', {
            qs: {
                teacherIds: res.locals.currentUser._id}
        }),
        api(req).get('/contents/' + req.params.id)]).
    then(([courses, content]) => {
        res.json({
            courses: courses,
            content: content
        });
    }).catch(err => {
        next(err);
    });
});

const getMockData = () => {
    return [{
        "type":"contents",
        "id":"d30a93520b09c714c5a2084b",
        "attributes":{
            "originId":"35005",
            "title":"Die Schul-Cloud",
            "client":"HPI",
            "url":"https://hpi.de/open-campus/hpi-initiativen/schul-cloud.html",
            "license":[
                "https://creativecommons.org/licenses/by-sa/4.0/"
            ],
            "image":"https://hpi.de/fileadmin/user_upload/hpi/bilder/infografiken/Schulcloud_Infografik_RGB.jpg",
            "description":"Das Hasso-Plattner-Institut startete in Kooperation mit dem Bundesministerium für Bildung und Forschung (BMBF) und dem bundesweiten Exzellenznetzwerk mathematisch-naturwissenschaftlicher Schulen (MINT-EC) das Pilotprojekt \"Schul-Cloud\". Die vom Hasso-Plattner-Institut konzipierte Cloud-...",
            "contentType":55,
            "lastModified":"2015-09-28T17:47:38.000Z",
            "updatedAt":"2017-04-24T15:22:26.038Z",
            "language":"de-de",
            "subjects":[
                "120",
                "200 40"
            ],
            "targetGroups":null,
            "tags":[
                "Videos",
                "Archiv",
                "Deutsch als Fremdsprache"
            ],
            "restrictions":null,
            "editorsPick":false
        },
        "links":{
            "self":"http://schul-cloud.org:8090/contents/d30a93520b09c714c5a2084b"
        }
    },
        {
            "type":"contents",
            "id":"d30a93520b09c714c5a2084b",
            "attributes":{
                "originId":"35005",
                "title":"MINT-EC Schul-Cloud",
                "client":"HPI",
                "url":"https://www.mint-ec.de/schulnetzwerk/schul-cloud/",
                "license":[
                    "https://creativecommons.org/licenses/by-sa/4.0/"
                ],
                "image":"https://www.mint-ec.de/fileadmin/_processed_/7/c/csm_MINT-EC_Logo_Claim_30a5460f7c.jpg",
                "description":"Während die Digitalisierung den außerschulischen Alltag von Schülerinnen und Schülern längst prägt, ist die Nutzung und inhaltliche Auseinandersetzung mit digitalen Medien im Unterricht immer noch eine Ausnahme. An den Schulen befinden sich zudem oft einzelne Rechner- und Serverräume mit veralteter Hard-...",
                "contentType":55,
                "lastModified":"2015-09-28T17:47:38.000Z",
                "updatedAt":"2017-04-24T15:22:26.038Z",
                "language":"de-de",
                "subjects":[
                    "120",
                    "200 40"
                ],
                "targetGroups":null,
                "tags":[
                    "Videos",
                    "Archiv",
                    "Deutsch als Fremdsprache"
                ],
                "restrictions":null,
                "editorsPick":false
            },
            "links":{
                "self":"http://schul-cloud.org:8090/contents/d30a93520b09c714c5a2084b"
            }
        },
        {
            "type":"contents",
            "id":"d30a93520b09c714c5a2084b",
            "attributes":{
                "originId":"35005",
                "title":"Für einen modernen Unterricht: die Schulcloud",
                "client":"HPI",
                "url":"https://www.bmbf.de/de/fuer-einen-modernen-unterricht-die-schulcloud-3606.html",
                "license":[
                    "https://creativecommons.org/licenses/by-sa/4.0/"
                ],
                "image":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/BMBF_Logo.svg/1200px-BMBF_Logo.svg.png",
                "description":"Digitale Lehr- und Lernangebote für verschiedene Fächer sollen künftig in einer Cloud zentral angeboten werden können. Bundesministerin Johanna Wanka hat das vom Bundesbildungsministerium geförderte Projekt beim IT-Gipfel vorgestellt....",
                "contentType":55,
                "lastModified":"2015-09-28T17:47:38.000Z",
                "updatedAt":"2017-04-24T15:22:26.038Z",
                "language":"de-de",
                "subjects":[
                    "120",
                    "200 40"
                ],
                "targetGroups":null,
                "tags":[
                    "Videos",
                    "Archiv",
                    "Deutsch als Fremdsprache"
                ],
                "restrictions":null,
                "editorsPick":false
            },
            "links":{
                "self":"http://schul-cloud.org:8090/contents/d30a93520b09c714c5a2084b"
            }
        },
        {
            "type":"contents",
            "id":"d30a93520b09c714c5a2084b",
            "attributes":{
                "originId":"35005",
                "title":"Die Cloud für Schulen in Deutschland: Konzept und Pilotierung der Schul-Cloud",
                "client":"HPI",
                "url":"https://publishup.uni-potsdam.de/opus4-ubp/files/10385/tbhpi116.pdf",
                "license":[
                    "https://creativecommons.org/licenses/by-sa/4.0/"
                ],
                "image":"",
                "description":"Die digitale Entwicklung durchdringt unser Bildungssystem, doch Schulen sind auf die Veränderungen kaum vorbereitet: Überforderte Lehrer/innen, infrastrukturell schwach ausgestattete Unterrichtsräume und unzureichend gewartete Computernetzwerke sind keine Seltenheit. Veraltete Hard- und Software...",
                "contentType":55,
                "lastModified":"2015-09-28T17:47:38.000Z",
                "updatedAt":"2017-04-24T15:22:26.038Z",
                "language":"de-de",
                "subjects":[
                    "120",
                    "200 40"
                ],
                "targetGroups":null,
                "tags":[
                    "Videos",
                    "Archiv",
                    "Deutsch als Fremdsprache"
                ],
                "restrictions":null,
                "editorsPick":false
            },
            "links":{
                "self":"http://schul-cloud.org:8090/contents/d30a93520b09c714c5a2084b"
            }
        },
        {
            "type":"contents",
            "id":"d30a93520b09c714c5a2084b",
            "attributes":{
                "originId":"35005",
                "title":"Cloud Computing",
                "client":"Wikipedia",
                "url":"https://de.wikipedia.org/wiki/Cloud_Computing",
                "license":[
                    "https://creativecommons.org/licenses/by-sa/4.0/"
                ],
                "image":"",
                "description":"Cloud Computing (deutsch Rechnerwolke[1]) beschreibt die Bereitstellung von IT-Infrastruktur wie beispielsweise Speicherplatz, Rechenleistung oder Anwendungssoftware als Dienstleistung über das Internet. Technischer formuliert umschreibt das Cloud Computing den Ansatz, IT-Infrastrukturen über...",
                "contentType":55,
                "lastModified":"2015-09-28T17:47:38.000Z",
                "updatedAt":"2017-04-24T15:22:26.038Z",
                "language":"de-de",
                "subjects":[
                    "120",
                    "200 40"
                ],
                "targetGroups":null,
                "tags":[
                    "Videos",
                    "Archiv",
                    "Deutsch als Fremdsprache"
                ],
                "restrictions":null,
                "editorsPick":false
            },
            "links":{
                "self":"http://schul-cloud.org:8090/contents/d30a93520b09c714c5a2084b"
            }
        },
        {
            "type":"contents",
            "id":"d30a93520b09c714c5a2084b",
            "attributes":{
                "originId":"35005",
                "title":"Die Schul-Cloud kommt",
                "client":"HPI",
                "url":"https://hpi.de/pressemitteilungen/2017/die-schul-cloud-kommt.html",
                "license":[
                    "https://creativecommons.org/licenses/by-sa/4.0/"
                ],
                "image":"",
                "description":"In wenigen Wochen wird die Schul-Cloud an 25 ausgewählten MINT-EC-Schulen bundesweit in die Testphase gehen. Das Hasso-Plattner-Institut (HPI) möchte die relevanten Vertreter aus der Politik, Bildung und Wissenschaft daher zusammenbringen und lädt am 3. April zu einem eintägigen Schul-Cloud-Forum...",
                "contentType":55,
                "lastModified":"2015-09-28T17:47:38.000Z",
                "updatedAt":"2017-04-24T15:22:26.038Z",
                "language":"de-de",
                "subjects":[
                    "120",
                    "200 40"
                ],
                "targetGroups":null,
                "tags":[
                    "Videos",
                    "Archiv",
                    "Deutsch als Fremdsprache"
                ],
                "restrictions":null,
                "editorsPick":false
            },
            "links":{
                "self":"http://schul-cloud.org:8090/contents/d30a93520b09c714c5a2084b"
            }
        },
    ];
}

router.get('/', function (req, res, next) {
    const query = req.query.q;

    const itemsPerPage = 12;
    const currentPage = parseInt(req.query.p) || 1;

    if(!query && !req.query.filter) {
        res.render('content/search', {
            title: 'Inhalte',
            query,
            results: [],
            subjects,
            suppressNoResultsMessage: true
        });
        return;
    }

    let selectedSubjects = _.cloneDeep(subjects);
    let querySubjects = ((req.query.filter || {}).subjects || []);
    if(!Array.isArray(querySubjects)) querySubjects = [querySubjects];
    querySubjects.forEach(s => {selectedSubjects[s].selected = true;});

    api(req).get('/contents/', {
        qs: {
            query,
            filter: req.query.filter,
            $limit: itemsPerPage,
            $skip: itemsPerPage * (currentPage - 1)
        }
    }).then(result => {

        let {meta = {}, data = []} = result;

        // get base url with all filters and query
        const urlParts = url.parse(req.originalUrl, true);
        urlParts.query.p = '{{page}}';
        delete urlParts.search;
        const baseUrl = url.format(urlParts);

        const pagination = {
            currentPage,
            numPages: Math.ceil((meta.page || {}).total / itemsPerPage),
            maxItems: 10,
            baseUrl
        };

        const total = result.total || "keine";

        data = getMockData();

        const results = data.map(result => {
            let res = result.attributes;
            res.href = result.id;
            return res;
        });

        let action = 'addToLesson';
        res.render('content/search', {
            title: 'Inhalte',
            query,
            results: _.chunk(results, 3),
            pagination,
            action,
            subjects: selectedSubjects,
            total
        });

    })
        .catch(error => {
            res.render('content/search', {
                title: 'Inhalte',
                query,
                subjects: selectedSubjects,
                notification: {
                    type: 'danger',
                    message: `${error.name} ${error.message}`
                }
            });
        });
});

router.post('/addToLesson', function (req, res, next) {
   api(req).post('/materials/', {
       json: req.body
   }).then(material => {
       api(req).patch('/lessons/' + req.body.lessonId, {
           json: {
               $push: {
                   materialIds: material._id
               }
           }
       }).then(result => {
           res.redirect('/content/?q=' + req.body.query);
       });
   }); 
});

module.exports = router;
