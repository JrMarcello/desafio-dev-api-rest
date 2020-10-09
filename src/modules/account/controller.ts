import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Account from './entity';
import Person from '../person/entity';

class Controller {
  /**
   * @api {get} /account Get accounts
   * @apiName GetAccounts
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "accounts": [
   *        {
   *           "idConta": 2,
   *           "saldo": "2500,50",
   *           "limiteSaqueDiario": "1000",
   *           "flagAtivo": true,
   *           "tipoConta": 2,
   *           "dataCriacao": "2020-10-09T18:08:24.999Z"
   *         },
   *         {
   *            "idConta": 1,
   *            "saldo": "1500",
   *            "limiteSaqueDiario": "1000",
   *            "flagAtivo": true,
   *            "tipoConta": 1,
   *            "dataCriacao": "2020-10-09T18:08:24.999Z"
   *         },
   *      ]
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const accounts = await getRepository(Account).find({ order: { idConta: 'DESC' } });

      return res.json({ accounts });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {get} /account/:id Get account
   * @apiName GetAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "account": {
   *          "idConta": 2,
   *          "saldo": "2500,50",
   *          "limiteSaqueDiario": "1000",
   *          "flagAtivo": true,
   *          "tipoConta": 2,
   *          "dataCriacao": "2020-10-09T18:08:24.999Z"
   *      }
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      const account = await getRepository(Account).findOne(params.id);

      return res.json({ account });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {get} /account/person/:idPerson Get account by person ID
   * @apiName GetAccountPerson
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "account": {
   *          "idConta": 2,
   *          "saldo": "2500,50",
   *          "limiteSaqueDiario": "1000",
   *          "flagAtivo": true,
   *          "tipoConta": 2,
   *          "dataCriacao": "2020-10-09T18:08:24.999Z"
   *      }
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async getByPersonId(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      if (!params || !params.idPerson) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const idPessoa = Number.parseInt(params.idPerson);
      const account = await getRepository(Account).findOne({ idPessoa });

      return res.json({ account });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {post} /account Create a Account
   * @apiName CreateAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam {string} idPessoa Person ID
   * @apiParam {string} [saldo] Account amount
   * @apiParam {string} [limiteSaqueDiario] Account daily limit
   * @apiParam {string} [flagAtivo] Account is active
   * @apiParam {string} [tipoConta] Account type
   *
   * @apiParamExample {json} Request-Example:
   *   {
   *      "idPessoa": 1,
   *      "saldo": 500,
   *      "limiteSaqueDiario": 1000,
   *      "tipoConta": 1
   *      "flagAtivo": true
   *   }
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   { success: "OK"   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      if (!body || !body.idPessoa) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const person = await getRepository(Person).findOne(body.idPessoa);
      if (!person) {
        return res.status(404).json({ error: 'Person not found' });
      }

      const data: Account = {
        idPessoa: body.idPessoa,
        saldo: body.saldo,
        limiteSaqueDiario: body.limiteSaqueDiario,
        flagAtivo: body.flagAtivo,
        tipoConta: body.tipoConta,
      };

      const account = await getRepository(Account).insert(data);

      return res.json({ account });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {get} /account/:id/balance Get balance
   * @apiName GetBalance
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "balance": 1500
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async balance(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      if (!params || !params.id) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const account = await getRepository(Account).findOne(params.id);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      return res.json({ balance: account.saldo });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {get} /account/:id/block Block a Account
   * @apiName AccountBloc
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "success": 200
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async block(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      if (!params || !params.id) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      await getRepository(Account).update(params.id, { flagAtivo: false });

      return res.json({ success: 200 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default Controller;
