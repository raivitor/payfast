module.exports = function(app) {
	app.get('/pagamentos', function(req, res) {
		console.log('recebida a requisição');
		res.send('Ok Raí');
	});

	app.post('/pagamentos/pagamento', function(req, res) {
		var pagamento = req.body;
		console.log(pagamento);
		pagamento.status = 'CRIADO';
		pagamento.data = new Date();

		var connection = app.persistencia.connectionFactory();
		var pagamentoDao = new app.persistencia.PagamentoDao(connection);
		/*
		pagamentoDao.lista(function (erro, resultado) {
			if(erro) console.log(erro);
			res.json(resultado);
		});*/
		
		pagamentoDao.salva(pagamento, function (erro, resultado) {
			console.log('salva');
			res.json(pagamento);
		});
	});
}