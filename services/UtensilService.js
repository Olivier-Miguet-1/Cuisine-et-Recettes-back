const UtensilSchema = require('../schemas/Utensil')
const _ = require('lodash')
const async = require('async')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

var Utensil = mongoose.model('Utensil', UtensilSchema)

Utensil.createIndexes()

module.exports.addOneUtensil = async function (Utensil, options, callback) {
    try {
        Utensil.user_id = options && options.user ? options.user._id: Utensil.user_id
        var new_Utensil = new Utensil(Utensil);
        var errors = new_Utensil.validateSync();
        if (errors) {
            errors = errors['errors'];
            var text = Object.keys(errors).map((e) => {
                return errors[e]['properties']['message'];
            }).join(' ');
            var fields = _.transform(Object.keys(errors), function (result, value) {
                result[value] = errors[value]['properties']['message'];
            }, {});
            var err = {
                msg: text,
                fields_with_error: Object.keys(errors),
                fields: fields,
                type_error: "validator"
            };
            callback(err);
        } else {
            await new_Utensil.save();
            callback(null, new_Utensil.toObject());
        }
    } catch (error) {
        if (error.code === 11000) { // Erreur de duplicité
            var field = Object.keys(error.keyValue)[0];
            var err = {
                msg: `Duplicate key error: ${field} must be unique.`,
                fields_with_error: [field],
                fields: { [field]: `The ${field} is already taken.` },
                type_error: "duplicate"
            };
            callback(err);
        } else {
            callback(error); // Autres erreurs
        }
    }
};

module.exports.findOneUtensilById = function (Utensil_id, options, callback) {
    var opts ={populate: options && options.populate ? ["user_id"] : []}
    if (Utensil_id && mongoose.isValidObjectId(Utensil_id)) {
        Utensil.findById(Utensil_id, null, opts).then((value) => {
            try {
                if (value) {
                    callback(null, value.toObject());
                } else {
                    callback({ msg: "Aucun ustensile trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
                console.log(e)
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    } else {
        callback({ msg: "ObjectId non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findManyUtensilsById = function (Utensils_id, options, callback) {
    var opts = {populate: (options && options.populate ? ["user_id"] : []), lean: true}
    if (Utensils_id && Array.isArray(Utensils_id) && Utensils_id.length > 0 && Utensils_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == Utensils_id.length) {
        Utensils_id = Utensils_id.map((e) => { return new ObjectId(e) })
        Utensil.find({ _id: Utensils_id }, null, opts).then((value) => {
            try {
                if (value && Array.isArray(value) && value.length != 0) {
                    callback(null, value);
                } else {
                    callback({ msg: "Aucun ustensile trouvé.", type_error: "no-found" });
                }
            }
            catch (e) {
                console.log(e)
            }
        }).catch((err) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        });
    }
    else if (Utensils_id && Array.isArray(Utensils_id) && Utensils_id.length > 0 && Utensils_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != Utensils_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: Utensils_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (Utensils_id && !Array.isArray(Utensils_id)) {
        callback({ msg: "L'argument n'est pas un tableau.", type_error: 'no-valid' });
    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}

module.exports.findOneUtensil = function (tab_field, value, options, callback) {
    var field_unique = ['name', 'description', 'price', 'quantity']
    var opts = {populate: options && options.populate ? ["user_id"] : []}

    if (tab_field && Array.isArray(tab_field) && value && _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1}).length == 0) {
        var obj_find = []
        _.forEach(tab_field, (e) => {
            obj_find.push({[e]: value})
        })
        Utensil.findOne({ $or: obj_find}, null, opts).then((value) => {
            if (value){
                callback(null, value.toObject())
            }else {
                callback({msg: "Utensil non trouvé.", type_error: "no-found"})
            }
        }).catch((err) => {
            callback({msg: "Error interne mongo", type_error:'error-mongo'})
        })
    }
    else {
        let msg = ''
        if(!tab_field || !Array.isArray(tab_field)) {
            msg += "Les champs de recherche sont incorrecte."
        }
        if(!value){
            msg += msg ? " Et la valeur de recherche est vide" : "La valeur de recherche est vide"
        }
        if(_.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1}).length > 0) {
            var field_not_authorized = _.filter(tab_field, (e) => { return field_unique.indexOf(e) == -1})
            msg += msg ? ` Et (${field_not_authorized.join(',')}) ne sont pas des champs de recherche autorisé.` : 
            `Les champs (${field_not_authorized.join(',')}) ne sont pas des champs de recherche autorisé.`
            callback({ msg: msg, type_error: 'no-valid', field_not_authorized: field_not_authorized })
        }
        else{
            callback({ msg: msg, type_error: 'no-valid'})
        }
    }
}

module.exports.findManyUtensils = function(search, limit, page, options, callback) {
    page = !page ? 1 : parseInt(page)
    limit = !limit ? 10 : parseInt(limit)
    var populate = options && options.populate ? ['user_id']: []
    if (typeof page !== "number" || typeof limit !== "number" || isNaN(page) || isNaN(limit)) {
        callback ({msg: `format de ${typeof page !== "number" ? "page" : "limit"} est incorrect`, type_error: "no-valid"})
    }else{
        let query_mongo = search ? {$or: _.map(["name", "description"], (e) => {return {[e]: {$regex: search}}})} : {}
        Utensil.countDocuments(query_mongo).then((value) => {
            if (value > 0) {
                const skip = ((page - 1) * limit)
                Utensil.find(query_mongo, null, {skip:skip, limit:limit, populate: populate, lean: true}).then((results) => {
                    callback(null, {
                        count: value,
                        results: results
                    })
                })
            }else{
                callback(null, {count: 0, results: []})
            }
        }).catch((e) => {
            callback(e)
        })
    }
}

module.exports.updateOneUtensil = function (Utensil_id, update, options, callback) {
    update.updated_at = new Date()
    if (Utensil_id && mongoose.isValidObjectId(Utensil_id)) {
        Utensil.findByIdAndUpdate(new ObjectId(Utensil_id), update, { returnDocument: 'after', runValidators: true }).then((value) => {
            try {
                // callback(null, value.toObject())
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Utensil non trouvé.", type_error: "no-found" });
            } catch (e) {
                callback(e)
            }
        }).catch((errors) => {
            if(errors.code === 11000){
                var field = Object.keys(errors.keyPattern)[0]
                const duplicateErrors = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                };
                callback(duplicateErrors)
            }else {
                errors = errors['errors']
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.updateManyUtensils = function (Utensils_id, update, options, callback) {
    // 
    if (Utensils_id && Array.isArray(Utensils_id) && Utensils_id.length > 0 && Utensils_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == Utensils_id.length) {
        Utensils_id = Utensils_id.map((e) => { return new ObjectId(e) })
        Utensil.updateMany({ _id: Utensils_id }, update, { runValidators: true }).then((value) => {
            try {
                // 
                if(value && value.matchedCount != 0){
                    callback(null, value)
                }else {
                    callback({msg: 'Utilisateurs non trouvé', type_error: 'no-found'})
                }
            } catch (e) {
                
                callback(e)
            }
        }).catch((errors) => {
            if(errors.code === 11000){
                var field = Object.keys(errors.keyPattern)[0]
                const duplicateErrors = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    index: errors.index,
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                };
                callback(duplicateErrors)
            }else {
                errors = errors['errors']
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.deleteOneUtensil = function (Utensil_id, options, callback) {
    if (Utensil_id && mongoose.isValidObjectId(Utensil_id)) {
        Utensil.findByIdAndDelete(Utensil_id).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                    callback({ msg: "Utensil non trouvé.", type_error: "no-found" });
            }
            catch (e) {
                
                callback(e)
            }
        }).catch((e) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}

module.exports.deleteManyUtensils = function (Utensils_id, options, callback) {
    if (Utensils_id && Array.isArray(Utensils_id) && Utensils_id.length > 0 && Utensils_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == Utensils_id.length) {
        Utensils_id = Utensils_id.map((e) => { return new ObjectId(e) })
        Utensil.deleteMany({ _id: Utensils_id }).then((value) => {
            callback(null, value)
        }).catch((err) => {
            callback({ msg: "Erreur mongo suppression.", type_error: "error-mongo" });
        })
    }
    else if (Utensils_id && Array.isArray(Utensils_id) && Utensils_id.length > 0 && Utensils_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != Utensils_id.length) {
        callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: Utensils_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
    }
    else if (Utensils_id && !Array.isArray(Utensils_id)) {
        callback({ msg: "L'argument n'est pas un tableau.", type_error: 'no-valid' });

    }
    else {
        callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
    }
}