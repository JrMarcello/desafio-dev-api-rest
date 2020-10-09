import { Request, Response } from 'express';
import { getRepository, Between } from 'typeorm';
import Account from '../account/entity';
import Transaction from './entity';

class Controller {
  /**
   * @api {put} /deposit Create a deposit transaction
   * @apiName DepositTransaction
   * @apiGroup Transaction
   * @apiVersion 1.0.0
   *
   * @apiParam {string} idConta Account ID
   * @apiParam {string} valor Tranctions value
   *
   * @apiParamExample {json} Request-Example:
   *   {
   *      "idConta": 1,
   *      "valor": 100
   *   }
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   { success: 200   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async deposit(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      if (!body || !body.idConta || !body.valor) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const idConta = Number.parseInt(body.idConta);
      const valor = Number.parseFloat(body.valor);
      if (valor < 1) {
        return res.status(400).json({ error: 'Invalid param [valor]' });
      }

      const account = await getRepository(Account).findOne(idConta);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      await getRepository(Account).manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.increment(Account, { idConta }, 'saldo', valor);
        await transactionalEntityManager.insert(Transaction, { idConta, valor });
      });

      return res.json({ success: 200 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {put} /withdraw Create a withdraw transaction
   * @apiName WithdrawTransaction
   * @apiGroup Transaction
   * @apiVersion 1.0.0
   *
   * @apiParam {string} idConta Account ID
   * @apiParam {string} valor Tranctions value
   *
   * @apiParamExample {json} Request-Example:
   *   {
   *      "idConta": 1,
   *      "valor": 100
   *   }
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   { success: 200   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async withdraw(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      if (!body || !body.idConta || !body.valor) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const idConta = Number.parseInt(body.idConta);
      const valor = Number.parseFloat(body.valor);
      if (valor < 1) {
        return res.status(400).json({ error: 'Invalid param [valor]' });
      }

      const account = await getRepository(Account).findOne(idConta);
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      await getRepository(Account).manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.decrement(Account, { idConta }, 'saldo', valor);
        await transactionalEntityManager.insert(Transaction, { idConta, valor: valor * -1 });
      });

      return res.json({ success: 200 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {get} /:accountId/extract Get Account extract
   * @apiName AccountExtract
   * @apiGroup Transact
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "extract": [
   *         {
   *            "idTransacao": 3,
   *            "valor": "-100",
   *            "dataTransacao": "2020-10-09T18:14:40.486Z"
   *          },
   *          {
   *            "idTransacao": 2,
   *            "valor": "200",
   *            "dataTransacao": "2020-10-09T18:14:16.767Z"
   *          },
   *          {
   *            "idTransacao": 1,
   *            "valor": "100",
   *            "dataTransacao": "2020-10-09T18:10:27.683Z"
   *          },
   *      ]
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async extract(req: Request, res: Response): Promise<Response> {
    try {
      const { params, query } = req;
      if (!params || !params.accountId) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const idConta = Number.parseInt(params.accountId);

      let where = { idConta };
      if (query && query.from && query.to) {
        where = Object.assign(where, { dataTransacao: Between(`${query.from} 00:00:00`, `${query.to} 23:59:59`) });
      }

      const extract = await getRepository(Transaction).find({
        where,
        order: { idTransacao: 'DESC' },
      });

      return res.json({ extract });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default Controller;
