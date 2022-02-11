const express = require('express');
const cors = require('cors')
const testConnection = require('./database').testConnection;
const handleInsertRecord = require('./Company.service').handleInsertRecord;
const handleSelectRecords = require('./Company.service').handleSelectRecords;
const handleSelectRecordsById = require('./Company.service').handleSelectRecordsById;
const handleUpdateRecord = require('./Company.service').handleUpdateRecord;
const handleSelectRecordsWithQuery = require('./Company.service').handleSelectRecordsWithQuery;
const handleDelete = require('./Company.service').handleDelete;
const handleSelectRecordsPaginated = require('./Company.service').handleSelectRecordsPaginated;
const handleSelectRecordsSorted = require('./Company.service').handleSelectRecordsSorted;
const handleSelectRecordsFiltered = require('./Company.service').handleSelectRecordsFiltered;

const Company = require('./database').Company;
const Founder = require('./database').Founder;
const sequelize = require('./database').sequelize;

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors())

app.get('/about', (req, res) => {
    res.send('This is my app. Nu face prea multe ...');
});

// get all Companies
app.get('/company', async (request, response) => {
    try {
        await handleSelectRecords(Company, response);
        response.status(200).json(records).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

// ------------ filter, sort, pagination ---------

app.get('/company/paginate', async (request, response) => {
    const page = request.query.page;
    const pageSize = request.query.pageSize;

    try {
        await handleSelectRecordsPaginated(Company, page, pageSize, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

app.get('/company/sort', async (request, response) => {
    const { field, direction } = request.query;
    if (!field || !direction || (direction != 'ASC' && direction != 'DESC')) {
        return response.status(400).json({
            message: "Bad request",
        });
    }

    try {
        await handleSelectRecordsSorted(Company, field, direction, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

app.get('/company/filter', async (request, response) => {
    const fields = request.query;
    console.log(fields);
    try {
        await handleSelectRecordsFiltered(Company, fields, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});


// ----- rest of CRUD -----

app.get('/company/:id', async (req, response) => {
    try {
        const record = await handleSelectRecordsById(Company, req.params.id);
        if (record == null) {
            return response.status(404).send();
        }
        response.json(record).status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
})

app.post('/company', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleInsertRecord(Company, request, response);
        response.status(201).json({
            message: "Created successfully a new Company",
            data: record
        });
    }
    catch (err) {
        response.status(400).json({
            message: "Bad request",
        });;
    }
})


app.put('/company/:id', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleUpdateRecord(Company, request.params.id, request.body);
        if (record == null) {
            return response.status(404).send();
        }

        response.status(200).json({
            message: "Updated successfully the Company",
            data: record
        });
    }
    catch (err) {
        console.log(err)
        response.status(400).json({
            message: "Bad request",
        });;
    }
})

app.delete('/company/:id', async (request, response) => {
    try {
        await handleDelete(Company, request.params.id, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});


// -------------------------- subresource ----------------- // 

app.get('/company/:id/Founder', async (req, response) => {
    try {
        await handleSelectRecordsWithQuery(Founder, { CompanyId: req.params.id }, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

//  ----------- BASIC CRUD -----------

app.get('/founder/:id', async (req, response) => {
    try {
        const record = await handleSelectRecordsById(Founder, req.params.id, response);
        if (record == null) {
            return response.status(404).send();
        }
        response.status(200).json(record).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
})

app.post('/founder', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleInsertRecord(Founder, request, response);
        response.status(201).json({
            message: "Created successfully a new Founder",
            data: record
        });
    }
    catch (err) {
        response.status(400).json({
            message: "Bad request",
        });;
    }
})

app.put('/founder/:id', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleUpdateRecord(Founder, request.params.id, request.body);
        if (record == null) {
            return response.status(404).send();
        }

        response.status(200).json({
            message: "Updated successfully the Founder",
            data: record
        });
    }
    catch (err) {
        console.log(err)
        response.status(400).json({
            message: "Bad request",
        });;
    }
})

app.delete('/founder/:id', async (request, response) => {
    try {
        await handleDelete(Founder, request.params.id, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

app.listen(4000, async () => {
    console.log('Started on port 4000...');
    try {

        await sequelize.sync()
    } catch (err) {
        console.log(err);
    }
    testConnection();
});