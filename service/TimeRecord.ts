import uuid from "uuid"

export interface TimeRecord {
    employeeId?: string
    id?: string
    date: string
    start: string
    end: string
    pause: string
}

export class TimeRecordService {
    timeRecords: TimeRecord[] = []
    async find(params: any) {
        return this.timeRecords.filter(
            item => item.employeeId === params.route.userId,
        )
    }
    async create(
        data: Pick<
            TimeRecord,
            "employeeId" | "date" | "start" | "end" | "pause"
        >,
    ) {
        const employee: TimeRecord = {
            ...data,
            id: uuid(),
        }
        this.timeRecords.push(employee)
        return employee
    }
}
