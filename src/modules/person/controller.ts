import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Person from './entity';

class Controller {
  /**
   * @api {get} /person Get persons
   * @apiName GetPersons
   * @apiGroup Person
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "persons": [
   *         {
   *           "idPessoa": 2,
   *           "nome": "Nattan Lucena",
   *           "cpf": "76699814079",
   *           "dataNascimento": "1985-01-01"
   *         },
   *         {
   *           "idPessoa": 1,
   *           "nome": "Marcello Jr",
   *           "cpf": "76699814079",
   *           "dataNascimento": "1987-02-09"
   *         }
   *      ]
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const persons = await getRepository(Person).find({ order: { idPessoa: 'DESC' } });

      return res.json({ persons });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {get} /person/:id Get person
   * @apiName GetPerson
   * @apiGroup Person
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "person": {
   *           "idPessoa": 1,
   *           "nome": "Marcello Jr",
   *           "cpf": "76699814079",
   *           "dataNascimento": "1987-02-09"
   *       }
   *   }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 500 Internal Server Error
   *     { "error": "message" }
   */
  public static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { params } = req;
      if (!params || !params.id) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const person = await getRepository(Person).findOne(params.id);

      return res.json({ person });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @api {post} /person Create a person
   * @apiName CreatePerson
   * @apiGroup Person
   * @apiVersion 1.0.0
   *
   * @apiParam {string} nome Person name
   * @apiParam {string} cpf Person CPF
   * @apiParam {string} dataNascimento Person date of birth
   *
   * @apiParamExample {json} Request-Example:
   *   {
   *      "nome": "Marcello Jr",
   *      "cpf": "03256178912"
   *      "dataNascimento": "1989-02-02"
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
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;
      if (!body || !body.nome || !body.cpf || !body.dataNascimento) {
        return res.status(400).json({ error: 'Invalid params' });
      }

      const data: Person = {
        nome: body.nome,
        cpf: body.cpf,
        dataNascimento: body.dataNascimento,
      };

      const person = await getRepository(Person).insert(data);

      return res.json({ person });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default Controller;
