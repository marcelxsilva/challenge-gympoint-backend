import Checkin from '../models/Checkin';
import Users from '../models/Users';

class CheckinController {
  async store(req, res) {

    const user = await Users.findOne({ where: { id: req.body.student_id } });
    if (!user) { return res.status(400).json({ error: 'user not exists' }) }

    const response = await Checkin.create(req.body)
    return res.json(response);

  }
}

export default new CheckinController();