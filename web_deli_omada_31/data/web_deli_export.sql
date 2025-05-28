BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "EIDOS" (
	"kodikos"	string,
	"onoma"	string,
	"timh"	float,
	"onoma_kathgorias"	string,
	"eikona"	string,
	PRIMARY KEY("kodikos"),
	CONSTRAINT "onoma_kat_fk" FOREIGN KEY("onoma_kathgorias") REFERENCES "KATHGORIA"("onoma") ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "KATASTHMA" (
	"kodikos"	string,
	"onoma"	string,
	"diefthinsi"	TEXT,
	"eikona"	string,
	PRIMARY KEY("kodikos")
);
CREATE TABLE IF NOT EXISTS "KATHGORIA" (
	"onoma"	string,
	PRIMARY KEY("onoma")
);
CREATE TABLE IF NOT EXISTS "KAT_PAR_EIDOS" (
	"kodikos_katasthmatos"	string,
	"kodikos_eidous"	string,
	PRIMARY KEY("kodikos_katasthmatos","kodikos_eidous"),
	CONSTRAINT "kod_eidous_fk" FOREIGN KEY("kodikos_eidous") REFERENCES "EIDOS"("kodikos") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "kod_katast_fk" FOREIGN KEY("kodikos_katasthmatos") REFERENCES "KATASTHMA" ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PARAGGELIA" (
	"kodikos"	string,
	"hmer_ora"	datetime,
	"tropos_pliromhs"	string,
	"kodikos_katasthmatos"	INTEGER,
	"email_pelath"	INTEGER,
	PRIMARY KEY("kodikos"),
	CONSTRAINT "email_fk" FOREIGN KEY("email_pelath") REFERENCES "PELATIS"("email") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "kod_katast_fk1" FOREIGN KEY("kodikos_katasthmatos") REFERENCES "KATASTHMA" ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PAR_PERIL_EIDOS" (
	"posothta"	INTEGER,
	"kodikos_paraggelias"	string,
	"kodikos_eidous"	string,
	CONSTRAINT "kod_eid_fk" FOREIGN KEY("kodikos_eidous") REFERENCES "EIDOS"("kodikos") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "kod_parag_fk" FOREIGN KEY("kodikos_paraggelias") REFERENCES "PARAGGELIA"("kodikos") ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PELATIS" (
	"email"	string,
	"password"	string,
	"onoma"	string,
	"eponymo"	string,
	"tilefono"	string,
	"diefthinsi"	TEXT,
	"orofos"	string,
	"onoma_per"	string,
	PRIMARY KEY("email"),
	CONSTRAINT "on_per_fk" FOREIGN KEY("onoma_per") REFERENCES "PERIOXH"("onoma") ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "PERIOXH" (
	"onoma"	string,
	PRIMARY KEY("onoma")
);
CREATE TABLE IF NOT EXISTS "PER_EXYPHRETEI_KAT" (
	"kodikos_katasthmatos"	string,
	"onoma_perioxhs"	string,
	PRIMARY KEY("kodikos_katasthmatos","onoma_perioxhs"),
	CONSTRAINT "kod_kat_fk2" FOREIGN KEY("kodikos_katasthmatos") REFERENCES "KATASTHMA"("kodikos") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "on_periox_fk" FOREIGN KEY("onoma_perioxhs") REFERENCES "PERIOXH"("onoma") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS"PEL_PROTIMA_KAT" (
	"email_pelath"	string,
	"kod_katast"	string,
	PRIMARY KEY("email_pelath","kod_katast"),
	CONSTRAINT "email_pel_prot_kat_fk" FOREIGN KEY("email_pelath") REFERENCES "PELATIS"("email") ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT "kod_katast_pel_prot_kat_fk" FOREIGN KEY("kod_katast") REFERENCES "KATASTHMA"("kodikos") ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO "EIDOS" VALUES ('EIDOS1','Σουβλάκι Χοιρινό',1.8,'Σουβλάκι','kotopoulo_psitopolis.png');
INSERT INTO "EIDOS" VALUES ('EIDOS2','Σουβλάκι Κοτόπουλο',1.8,'Σουβλάκι','xoirino_psitopolis.png');
INSERT INTO "KATASTHMA" VALUES ('KATAST1','Ψητόπολις','Πλατεία Γεωργίου Α'' 50','psitopolis.png');
INSERT INTO "KATHGORIA" VALUES ('Σουβλάκι');
INSERT INTO "KATHGORIA" VALUES ('Καφές');
INSERT INTO "KATHGORIA" VALUES ('Κρέπα');
INSERT INTO "KATHGORIA" VALUES ('Πίτσα');
INSERT INTO "KATHGORIA" VALUES ('Μεξικάνικο');
INSERT INTO "KATHGORIA" VALUES ('Κινέζικο');
INSERT INTO "KATHGORIA" VALUES ('Ζυμαρικά');
INSERT INTO "KATHGORIA" VALUES ('Γλυκό');
INSERT INTO "KAT_PAR_EIDOS" VALUES ('KATAST1','EIDOS1');
INSERT INTO "KAT_PAR_EIDOS" VALUES ('KATAST1','EIDOS2');
INSERT INTO "PARAGGELIA" VALUES ('PARAG1','17-5-2025 19:38','Μετρητά','KATAST1','gpapa@gmail.com');
INSERT INTO "PAR_PERIL_EIDOS" VALUES (2,'PARAG1','EIDOS1');
INSERT INTO "PELATIS" VALUES ('gpapa@gmail.com',12345678,'Γιώργος','Παπάς',6981234567,'Έλληνος Στρατιώτου 5','5ος','Άγιος Αλέξιος');
INSERT INTO "PERIOXH" VALUES ('Άγιος Αλέξιος');
INSERT INTO "PERIOXH" VALUES ('Αγία Αικατερίνη');
INSERT INTO "PERIOXH" VALUES ('Αγία Βαρβάρα');
INSERT INTO "PERIOXH" VALUES ('Αγία Σοφία');
INSERT INTO "PERIOXH" VALUES ('Αγία Τριάδα');
INSERT INTO "PERIOXH" VALUES ('Άγιοι Απόστολοι');
INSERT INTO "PERIOXH" VALUES ('Άγιος Ανδρέας');
INSERT INTO "PERIOXH" VALUES ('Άγιος Γεράσιμος');
INSERT INTO "PERIOXH" VALUES ('Άγιος Γεώργιος Λάγγουρα');
INSERT INTO "PERIOXH" VALUES ('Άγιος Δημήτριος');
INSERT INTO "PERIOXH" VALUES ('Άγιος Διονύσιος');
INSERT INTO "PERIOXH" VALUES ('Αγυιά');
INSERT INTO "PERIOXH" VALUES ('Αμπελόκηποι');
INSERT INTO "PERIOXH" VALUES ('Αναπηρικά Ιτεών');
INSERT INTO "PERIOXH" VALUES ('Άνθεια');
INSERT INTO "PERIOXH" VALUES ('Ανθούπολη');
INSERT INTO "PERIOXH" VALUES ('Αρόη');
INSERT INTO "PERIOXH" VALUES ('Ασύρματος');
INSERT INTO "PERIOXH" VALUES ('Βλατερό');
INSERT INTO "PERIOXH" VALUES ('Βουδ');
INSERT INTO "PERIOXH" VALUES ('Γλαράκη');
INSERT INTO "PERIOXH" VALUES ('Γαλαξιδιώτικα');
INSERT INTO "PERIOXH" VALUES ('Γεραναίικα');
INSERT INTO "PERIOXH" VALUES ('Γηροκομείο');
INSERT INTO "PERIOXH" VALUES ('Γκαζοχώρι');
INSERT INTO "PERIOXH" VALUES ('Γούβα');
INSERT INTO "PERIOXH" VALUES ('Δάφνες');
INSERT INTO "PERIOXH" VALUES ('Δασύλλιο');
INSERT INTO "PERIOXH" VALUES ('Δεμένικα');
INSERT INTO "PERIOXH" VALUES ('Δεξαμενή');
INSERT INTO "PERIOXH" VALUES ('Διάκου');
INSERT INTO "PERIOXH" VALUES ('Δροσιά');
INSERT INTO "PERIOXH" VALUES ('Εβραιομνήματα');
INSERT INTO "PERIOXH" VALUES ('Εγγλέζικα');
INSERT INTO "PERIOXH" VALUES ('Εγλυκάδα');
INSERT INTO "PERIOXH" VALUES ('Εσχατοβούνι');
INSERT INTO "PERIOXH" VALUES ('Ζαβλάνι');
INSERT INTO "PERIOXH" VALUES ('Ζαρουχλέικα');
INSERT INTO "PERIOXH" VALUES ('Ιτιές');
INSERT INTO "PERIOXH" VALUES ('Καντριάνικα');
INSERT INTO "PERIOXH" VALUES ('Καστελλόκαμπος');
INSERT INTO "PERIOXH" VALUES ('Κέντρο');
INSERT INTO "PERIOXH" VALUES ('Κλουκινιώτικα');
INSERT INTO "PERIOXH" VALUES ('Κόκκινος Μύλος');
INSERT INTO "PERIOXH" VALUES ('Κοτρώνι');
INSERT INTO "PERIOXH" VALUES ('Κουκούλι');
INSERT INTO "PERIOXH" VALUES ('Κούτσα');
INSERT INTO "PERIOXH" VALUES ('Κρητικά');
INSERT INTO "PERIOXH" VALUES ('Κρύα Ιτεών');
INSERT INTO "PERIOXH" VALUES ('Κυνηγού');
INSERT INTO "PERIOXH" VALUES ('Κυψέλη');
INSERT INTO "PERIOXH" VALUES ('Λαδόπουλου');
INSERT INTO "PERIOXH" VALUES ('Λεύκα');
INSERT INTO "PERIOXH" VALUES ('Λιαπαίικα');
INSERT INTO "PERIOXH" VALUES ('Λυκοχορός');
INSERT INTO "PERIOXH" VALUES ('Μαγουλιανίτικα');
INSERT INTO "PERIOXH" VALUES ('Μακρυγιάννη');
INSERT INTO "PERIOXH" VALUES ('Μαντζαβιναίικα');
INSERT INTO "PERIOXH" VALUES ('Μαρκάτο');
INSERT INTO "PERIOXH" VALUES ('Μαρούδα');
INSERT INTO "PERIOXH" VALUES ('Μεταμόρφωση Σωτήρος');
INSERT INTO "PERIOXH" VALUES ('Μπάλα');
INSERT INTO "PERIOXH" VALUES ('Μπεγουλάκι');
INSERT INTO "PERIOXH" VALUES ('Νεάπολη');
INSERT INTO "PERIOXH" VALUES ('Παγώνα');
INSERT INTO "PERIOXH" VALUES ('Παναγία Αλεξιώτισσα');
INSERT INTO "PERIOXH" VALUES ('Περιβόλα');
INSERT INTO "PERIOXH" VALUES ('Πόρτες');
INSERT INTO "PERIOXH" VALUES ('Πράτσικα');
INSERT INTO "PERIOXH" VALUES ('Προάστιο');
INSERT INTO "PERIOXH" VALUES ('Προφήτης Ηλίας');
INSERT INTO "PERIOXH" VALUES ('Ριγανόκαμπος');
INSERT INTO "PERIOXH" VALUES ('Ρομάντζα');
INSERT INTO "PERIOXH" VALUES ('Σύνορα');
INSERT INTO "PERIOXH" VALUES ('Σαμακιά');
INSERT INTO "PERIOXH" VALUES ('Σκαγιοπούλειο');
INSERT INTO "PERIOXH" VALUES ('Σκιόεσσα');
INSERT INTO "PERIOXH" VALUES ('Συχαινά');
INSERT INTO "PERIOXH" VALUES ('Τέρψη');
INSERT INTO "PERIOXH" VALUES ('Ταμπάχανα');
INSERT INTO "PERIOXH" VALUES ('Ταραμπούρα');
INSERT INTO "PERIOXH" VALUES ('Τάσι');
INSERT INTO "PERIOXH" VALUES ('Τερψιθέα');
INSERT INTO "PERIOXH" VALUES ('Τζίνη');
INSERT INTO "PERIOXH" VALUES ('Τριτάκη');
INSERT INTO "PERIOXH" VALUES ('Τσιβδί');
INSERT INTO "PERIOXH" VALUES ('Χαλκωματά');
INSERT INTO "PERIOXH" VALUES ('Ψάχου');
INSERT INTO "PERIOXH" VALUES ('Ψαροφάι');
INSERT INTO "PERIOXH" VALUES ('Ψηλαλώνια');
INSERT INTO "PER_EXYPHRETEI_KAT" VALUES ('KATAST1','Άγιος Αλέξιος');
COMMIT;
