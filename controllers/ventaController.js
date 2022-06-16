var mongoose = require('mongoose');

const venta = mongoose.model('Venta');

//Mis Ventas
exports.miListaVentas = async function (req, res) {

  try {
    const listaProductos = await venta.aggregate(
      [{ "$match": { 'idVendedor': req.query.idVendedor } },
      { "$lookup": { "from": "Usuario", "localField": "idComprador", "foreignField": "ruc", "as": "Usuario" } },
      { "$project": { "_id": 0, "Usuario": { "_id": 0, "clave": 0, "correo": 0, "telefono": 0, "ruc": 0 } } },
      { "$unwind": { "path": "$Usuario", "preserveNullAndEmptyArrays": true } },
      { "$project": { "nombreComprador": "$Usuario.nombre", "idComprador": 1, "nombreProducto": 1, "cantidad": 1, "fecha": { "$dateToString": { "date": "$fecha", "format": "%d-%m-%Y" } }, "precio": 1 } }]);
    res.json(listaProductos);
  }
  catch (error) {
    res.status('500').send(error);
  }
}


//Mis Compras
exports.miListaCompras = async function (req, res) {

  try {
    const listaProductos = await venta.aggregate(
      [{ "$match": { 'idComprador': req.query.idVendedor } },
      { "$lookup": { "from": "Usuario", "localField": "idVendedor", "foreignField": "ruc", "as": "Usuario" } },
      { "$project": { "_id": 0, "Usuario": { "_id": 0, "clave": 0, "correo": 0, "telefono": 0, "ruc": 0 } } },
      { "$unwind": { "path": "$Usuario", "preserveNullAndEmptyArrays": true } },
      { "$project": { "nombreComprador": "$Usuario.nombre", "idVendedor": 1, "nombreProducto": 1, "cantidad": 1, "fecha": { "$dateToString": { "date": "$fecha", "format": "%d-%m-%Y" } }, "precio": 1 } }]);
    res.json(listaProductos);
  }
  catch (error) {
    res.status('500').send(error);
  }

};
