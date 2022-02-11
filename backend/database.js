const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = new Sequelize('examen_tw', 'root', 'myXAMPPPassword01', {
    host: 'localhost',
    dialect: 'mariadb',
    "define":{
        "timestamps":false
      }
    },
    {timestamps: false}
    
);


class Company extends Model {};
Company.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: DataTypes.DATE,
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    }
}, { sequelize, modelName: 'company'});

class Founder extends Model {};
Founder.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: DataTypes.ENUM('CEO', 'CTO'),
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {sequelize, modelName: 'founder'});


Company.hasMany(Founder);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }    
};

module.exports = { testConnection, sequelize, Founder, Company };