const express= require("express");
const path= require("path");
const fs= require("fs");
const sharp= require("sharp");
const sass = require("sass");
const pg = require("pg");

const Client = pg.Client;

let client = new Client({
    database: "proiect",
    user: "andreibutnaru",
    password: "postgres",
    host: "localhost",
    port: 5432
});

client.connect();

app = express();

app.set("view engine", "ejs");

console.log("Folder index.js",  __dirname);
console.log("Cale fisier index.js",  __filename);
console.log("Folder curent de lucru",  process.cwd());

obGlobal ={
    obErori: {},
    obImagini: {},
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup")
}

vectorFoldere= ["temp", "poze_uploadate", "backup"];
for (let folder of vectorFoldere){
    let folderAbsolutePath = path.join(__dirname, folder);
    if (!fs.existsSync(folderAbsolutePath))
        fs.mkdirSync(folderAbsolutePath);
}

app.use("/resurse", express.static(path.join(__dirname,"resurse"))); //folder static

// Trimit categoriile in toate paginile
app.use((req, res, next) => {
    client.query("SELECT * FROM unnest(enum_range(null::categ_aparatura))", function(err, rezOptiuni) {
        if (err) {
            next(err);
        } else {
            res.locals.optiuni = rezOptiuni.rows;
            next();
        }
    });
});

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse/imagini/ico/favicon/favicon.ico"));
});

app.get(["/","/index","/home"], function(req, res){
    res.render("pagini/index", {ip: req.ip, imagini:obGlobal.obImagini.imagini});
});

app.get("/galerie", function(req, res) {
    res.render("pagini/galerie", { imagini:obGlobal.obImagini.imagini });
});

app.get("/produse", function(req, res){
    let conditieQuery = "";
    if (req.query.tip) {
        conditieQuery = ` WHERE categorie = '${req.query.tip}'`;
    }
    client.query(`SELECT * FROM aparatura ${conditieQuery}`, function(err, rez) {
        if (err) {
            afisareEroare(res, 500);
        } else {
            res.render("pagini/produse", { produse: rez.rows });
        }
    });
});

app.get("/produs/:id", function(req, res){
    let idProdus = req.params.id;
    client.query(`SELECT * FROM aparatura WHERE id = ${idProdus}`, function(err, rez) {
        if (err || rez.rows.length == 0) {
            afisareEroare(res, 404, "Produs negasit", "Produsul cu id-ul specificat nu exista.");
        } else {
            res.render("pagini/produs", { prod: rez.rows[0] });
        }
    });
});

app.get(/^\/resurse\/[a-z0-9A-Z\/]*\/$/, function(req, res){
    afisareEroare(res, 403);
});

app.get("/*.ejs", function(req,res){
    afisareEroare(res, 400);
});

app.get("/*", function(req, res){
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if (err){
                if (err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res, 404, "Pagina negasita", "Verificati URL-ul");
                } 
                else{
                    afisareEroare(res, -1);
                }
            }
            else {
                res.send(rezRandare);
            }
        })
    }
    catch(err1){
        if (err1.message.startsWith("Cannot find module")){
            afisareEroare(res, 404, "Pagina negasita", "Verificati URL-ul");
        }
        else {
            afisareEroare(res, -1);
        }
    }   
})


initErori();
initImagini();

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    obGlobal.obErori=JSON.parse(continut);
    obGlobal.obErori.eroare_default.imagine = path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);

    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
}

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare = obGlobal.obErori.info_erori.find(function(elem){
        return elem.identificator == identificator;
    });
    if(eroare){
        if(eroare.status)
            res.status(identificator);
        var titluCustom = titlu || eroare.titlu;
        var textCustom = text || eroare.text;
        var imagineCustom = imagine || eroare.imagine;
    }
    else{
        var err = obGlobal.obErori.eroare_default;
        var titluCustom = titlu || err.titlu;
        var textCustom = text || err.text;
        var imagineCustom = imagine || err.imagine;
    }
    res.render("pagini/eroare", { 
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
    })
}

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname, obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    for (let imag of vImagini){
        [numeFis, ext] = imag.cale_fisier.split(".");
        let caleFisAbs = path.join(caleAbs, imag.cale_fisier);
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu = path.join("/", obGlobal.obImagini.cale_galerie, "mediu", numeFis+".webp");
        imag.fisier = path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_fisier);
    }

}

app.listen(8080);

function compileazaScss(caleScss, caleCss) {
    if(!caleCss){
        let numeFisExt = path.basename(caleScss);
        let numeFis = numeFisExt.split(".")[0];
        caleCss = numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss);
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss);
    
    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true});
    }
    
    // la acest punct avem cai absolute in caleScss si caleCss
    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        let timestamp = Date.now();
        let numeFisCssBackup = numeFisCss.replace(".css", `_${timestamp}.css`);
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCssBackup));
    }
    rez = sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css);
}

vFisiere = fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis) == ".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis) {
    if (eveniment == "change" || eveniment == "rename"){
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})