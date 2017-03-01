module.exports = function(app) {
	app.get('/pagamentos', function(req, res) {
		console.log('recebida a requisição');
		res.send('Ok Raí');
	});

	app.delete('/pagamentos/pagamento/:id', function(req, res) {
		var pagamento = {};
		var id = req.params.id;

		pagamento.id = id;
		pagamento.status = 'CANCELADO';

		var connection = app.persistencia.connectionFactory();
		var pagamentoDao = new app.persistencia.PagamentoDao(connection);

		pagamentoDao.atualiza(pagamento, function(erro) {
			if (erro) {
				res.status(500).send(erro);
				return;
			}
			console.log('pagamento cancelado');
			res.status(202).json(pagamento);

		});
	});

	app.put('/pagamentos/pagamento/:id', function(req, res) {
		var pagamento = {};
		var id = req.params.id;

		pagamento.id = id;
		pagamento.status = 'CONFIRMADO';

		var connection = app.persistencia.connectionFactory();
		var pagamentoDao = new app.persistencia.PagamentoDao(connection);
		pagamentoDao.atualiza(pagamento, function(erro) {
			if (erro) {
				res.status(500).send(erro);
				return;
			} else {
				res.send(pagamento);
			}
		});
	});

	app.post('/pagamentos/pagamento', function(req, res) {
		var pagamento = req.body["pagamento"];
		pagamento.status = 'CRIADO';
		pagamento.data = new Date();

		req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
		req.assert("pagamento.valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
		req.assert("pagamento.moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3, 3);

		var errors = req.validationErrors();
		if (errors) {
			console.log("Erros de validação encontrados");
			res.status(400).send(errors);
			return;
		}
		var connection = app.persistencia.connectionFactory();
		var pagamentoDao = new app.persistencia.PagamentoDao(connection);
		pagamentoDao.salva(pagamento, function(erro, resultado) {
			if (erro) {
				res.status(500).send(errors);
				return;
			}
			pagamento.id = resultado.insertId;
			/*
			if(pagamento.forma_de_pagamento == 'cartao'){
				var cartao = req.body['cartao'];
				var clienteCartoes = new app.servicos.clienteCartoes();
				clienteCartoes.autoriza(cartao, function (exception, request, response, retorno) {
					if(exception) {
						console.log(exception);
						res.status(400).send(exception);
						return;
					}
					res.status(201).json(retorno);
					return;
				});
			}
			*/
			res.location('/pagamentos/pagamento/' + pagamento.id);
			var response = {
				dados_do_pagamento: pagamento,
				cartao: req.body['cartao'],
				links: [{
					href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
					rel: "confirmar",
					method: "PUT"
				}, {
					href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
					rel: "cancelar",
					method: "DELETE"
				}]
			}
			res.status(201).json(response);
		});
	});
}