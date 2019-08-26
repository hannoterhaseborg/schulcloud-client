const { URL } = require('url');

const specificFiles = {
	privacyExemplary: 'Onlineeinwilligung/Datenschutzerklaerung-Muster-Schulen-Onlineeinwilligung.pdf',
	privacy: 'Onlineeinwilligung/Datenschutzerklaerung-Onlineeinwilligung.pdf',
	termsOfUseExemplary: 'Onlineeinwilligung/Nutzungsordnung-HPI-Schule-Schueler-Onlineeinwilligung.pdf',
	termsOfUse: 'Onlineeinwilligung/Nutzungsordnung-Onlineeinwilligung.pdf',
};

const globalFiles = {
	BeschreibungDerSchulCloud: 'Dokumente/Beschreibung-der-HPI-Schul-Cloud.pdf',
	TechnischerBericht2019:
	'Dokumente/Die-HPI-Schul-Cloud_Roll-Out-einer-Cloud-Architektur-für-Schulen-in-Deutschland.pdf',
	BroschuereSCimUnterricht1:
	'Willkommenordner/Begleitmaterial/Broschuere_Die-Schul-Cloud-im-Unterricht-Fachuebergreifende-Unterrichtsszenarien-und-Methoden.pdf',
	BroschuereSCimUnterricht2:
	'Willkommenordner/Begleitmaterial/Broschuere_Die-Schul-Cloud-im-Unterricht-und-Schulalltag-Mehrwert-und-Voraussetzungen.pdf',
	BroschuereSCundLernen4:
	'Willkommenordner/Begleitmaterial/Broschuere_HPI-Schul-Cloud-und-Lernen-4.0.pdf',
	SchulrechnerInDieSC2017: 'Dokumente/Schulrechner-wandern-in-die-Cloud-2017.pdf',
	SCKonzeptPilotierung2017: 'Dokumente/Konzept-und-Pilotierung-der-Schul-Cloud-2017.pdf',
};

const documentBaseDir = process.env.DOCUMENT_BASE_DIR || 'https://schul-cloud-hpi.s3.hidrive.strato.com/';

module.exports = {
	defaultDocuments: () => ({
		documentBaseDir,
		specificFiles: baseDir => Object.entries(specificFiles).reduce((obj, [key, value]) => {
			obj[key] = String(new URL(value, baseDir));
			return obj;
		}, {}),
		globalFiles: () => Object.entries(globalFiles).reduce((obj, [key, value]) => {
			obj[key] = String(new URL(`global/${value}`, documentBaseDir));
			return obj;
		}, {}),
	}),
};