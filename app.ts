import feathers from "@feathersjs/feathers"
import "@feathersjs/transport-commons"
import express from "@feathersjs/express"
import socketio from "@feathersjs/socketio"
import NeDB from "nedb"
import path from "path"

import {
    TimeRecordService,
    EmployeeService,
    Employee,
    TimeRecord,
} from "./service"

const Model = new NeDB({
    filename: path.join("./data", "employees.db"),
    autoload: true,
})

const options = {
    Model,
    id: "id",
    paginate: {
        default: 2,
        max: 4,
    },
}

const app = express(feathers())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.configure(express.rest())
app.configure(socketio())
app.use(express.errorHandler())

app.use("/records", new TimeRecordService())
app.use("/users", new EmployeeService(options, app))

app.use("/users/:userId/records", app.service("records"))

function mapEmployeeIdToData(context: any) {
    if (context.data && context.params.route.userId) {
        context.data.employeeId = context.params.route.userId
    }
}

app.service("users/:userId/records").hooks({
    before: {
        find(context: any) {
            context.params.query.employeeId = context.params.route.userId
        },
        create: mapEmployeeIdToData,
        update: mapEmployeeIdToData,
        patch: mapEmployeeIdToData,
    },
})

app.service("users").on("created", (message: Employee) => {
    console.log("A new Employee has been created", message)
})
app.service("records").on("created", (message: TimeRecord) => {
    console.log("A new Record has been created", message)
})

const main = async () => {
    let employee: Employee = {
        firstName: "Testi",
        lastName: "Tester",
        timeFrame: "week",
        hoursPerFrame: 38,
    }
    employee = await app.service("users").create(employee)

    let timeFrame: TimeRecord = {
        date: "2019-10-13",
        start: "08:00",
        end: "17:00",
        pause: "0:45",
    }
    timeFrame = await app
        .service("records")
        .create(timeFrame, { route: { userId: employee.id } })
}

app.listen(3030).on("listening", () =>
    console.log("Feathers server listening on localhost:3030"),
)
main()
