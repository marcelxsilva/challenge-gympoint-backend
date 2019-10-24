import Users from '../models/Users';
import * as yup from 'yup';


class UserController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password_entry: yup.string().required().min(6),
      level: yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' })
    }
    const userExists = await Users.findOne({ where: { email: req.body.email } });
    if (userExists) { return res.status(400).json({ error: 'users already exists' }); }
    const { id, name, email, level } = await Users.create(req.body);

    return res.json({
      user: {
        id,
        name,
        email,
        level
      }
    });
  }

  async update(req, res) {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      name: yup.string(),
      oldPassword: yup.string().min(4),
      password_entry: yup.string().min(4).when('oldPassword', (password_entry, field) => {
        password_entry ? field.required() : field;
      })
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails in password' })
    }
    const { email, oldPassword } = req.body;
    const user = await Users.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email: email } });
      if (userExists) { return res.status(400).json({ error: 'email already exists' }); }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'password does not match' });
    }

    const { id, name, level } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      level
    });



  }
}
export default new UserController();