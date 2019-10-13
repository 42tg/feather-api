import uuid from "uuid"

export interface Employee {
    id?: string
    firstName: string
    lastName: string
    timeFrame: "week" | "month"
    hoursPerFrame: number
}

export class EmployeeService {
    employees: Employee[] = []
    async find() {
        return this.employees
    }
    async create(
        data: Pick<
            Employee,
            "firstName" | "lastName" | "hoursPerFrame" | "timeFrame"
        >,
    ) {
        const { firstName, lastName, timeFrame, hoursPerFrame } = data
        const employee: Employee = {
            id: uuid(),
            firstName,
            lastName,
            timeFrame,
            hoursPerFrame,
        }
        this.employees.push(employee)
        return employee
    }
}
