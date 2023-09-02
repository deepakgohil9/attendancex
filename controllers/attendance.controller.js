const mongoose = require('mongoose')
const Attendance = require('../models/attendance.model')
const Student = require('../models/student.model')

const mark_attendance = async (req, res, next) => {
	try {
		let attendance = await Attendance.findOne({ date: req.body.date, class: req.body.class }).populate(['class', 'attendance.student'])
		if (attendance) {
			return res.send({ message: 'attendance already marksheet created', data: attendance })
		}

		const students = await Student.aggregate([
			{ '$match': { class: new mongoose.Types.ObjectId(req.body.class) } },
			{ '$project': { student: '$_id', _id: 0 } }
		])

		attendance = Attendance({ date: req.body.date, class: req.body.class, attendance: students })
		attendance = await attendance.save()
		attendance = await attendance.populate(['class', 'attendance.student'])

		return res.status(201).send({ message: 'attendance marksheet created', data: attendance })
	} catch (error) {
		next(error)
	}
}

const get_attendance = async (req, res, next) => {
	try {
		const attendance = await Attendance.findOne({ date: req.params.date, class: req.params.class }).populate(['class', 'attendance.student'])
		return res.send({ message: 'attendance marksheet fetched', data: attendance })
	} catch (error) {
		next(error)
	}
}

const update_attendance = async (req, res, next) => {
	try {
		const attendance = await Attendance.updateOne({ _id: req.body.id, 'attendance.student': req.body.student }, { $set: { 'attendance.$.mark': req.body.mark } }, { new: true })
		return res.send({ message: 'attendance marked!', data: attendance })
	} catch (error) {
		next(error)
	}
}

module.exports = { mark_attendance, update_attendance, get_attendance }