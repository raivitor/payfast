module.exports = function(app) {
	app.get('/pagamentos', function(req, res) {
		console.log('recebida a requisição');
		res.send('Ok Raí');
	});

	app.post('/pagamentos/pagamento', function(req, res) {
		var pagamento = req.body;
		pagamento.status = 'CRIADO';
		pagamento.data = new Date();

		req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
		req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
		req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

		var errors = req.validationErrors();
		if (errors) {
			console.log("Erros de validação encontrados");
			res.status(400).send(errors);
			return;
		}
		var connection = app.persistencia.connectionFactory();
		var pagamentoDao = new app.persistencia.PagamentoDao(connection);
		pagamentoDao.salva(pagamento, function(erro, resultado) {
			if(erro) {
				res.status(500).send(errors);
			}
			else{
				console.log('Pagamento criado');
				//res.location('/pagamentos/pagamento/' + resultado.insertId);
				res.status(201).json(resultado);
			}
		});
	});
}