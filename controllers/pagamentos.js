module.exports = function(app) {
	app.get('/pagamentos', function(req, res) {
		console.log('recebida a requisição');
		res.send('Ok Raí');
	});
}