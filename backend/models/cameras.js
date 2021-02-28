module.exports = (sequelize, DataTypes) => {
  const camera = sequelize.define(
    "camera", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      location: {
        type: DataTypes.STRING
      },
      mode: {
        type: DataTypes.STRING,
        defaultValue: "live"
      },
      access_path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      room_size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      distance_criteria: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      proper_n_people: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      blurring: {
        type: DataTypes.BOOLEAN
      },
      alarm_by_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      alarm_criteria: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      comment: "Camera and space settings"
    }
  );
  camera.associate = (models) => {
    camera.hasMany(models.minutely_data, {
      foreignKey: 'camera_id'
    });
    camera.hasMany(models.hourly_data, {
      foreignKey: 'camera_id'
    });
    camera.hasMany(models.daily_data, {
      foreignKey: 'camera_id'
    });
    camera.belongsTo(models.user, {
      foreignKey: 'user_id'
    });
  }
  return camera;
};