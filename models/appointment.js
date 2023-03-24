"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static addAppointment({ name, dueDate, startTime, endTime, userId }) {
      return this.create({
        name: name,
        dueDate: dueDate,
        startTime: startTime,
        endTime: endTime,
        userId,
      });
    }

    static getTodayEvent(dueDate, userId) {
      return this.findAll({
        where: { dueDate, userId },
        order: [["id", "ASC"]],
      });
    }

    static getAppointments(userId) {
      return this.findAll({
        where: { userId },
        order: [["id", "ASC"]],
      });
    }

    static findAppointment(id, userId) {
      return this.findOne({
        where: {
          userId,
          id,
        },
      });
    }

    static updateAppointment(id, appointmentName, userId) {
      return this.update(
        { name: appointmentName },
        {
          where: {
            id,
            userId,
          },
        }
      );
    }

    static delAppointment(id, userId) {
      this.destroy({
        where: {
          id,
          userId,
        },
      });
    }
  }
  Appointment.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: {
            args: 5,
            msg: "Appointment name length must greater than 5",
          },
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: {
            msg: "Please enter a valid date",
          },
        },
      },
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
