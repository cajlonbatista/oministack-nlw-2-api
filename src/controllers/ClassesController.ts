import {Request, Response, json} from "express";

import db from "../database/connection";
import converterTime from "../utils/converterTime";

interface ScheduleItem {
    week_day: number,
    from: string,
    to: string,
}


export default class ClassesController{
    async index(req: Request, res: Response){
        const filters = req.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if(!filters.subject || !filters.week_day || !filters.time){
            return res.status(404).json({
                error : "Missing filters to search"
            })
        }
        const timeMinutes = converterTime(time);

        console.log(timeMinutes);

        const classes = await db("classes")
        .whereExists(function(){
            this.select("classes_schedule.*")
            .from("classes_schedule")
            .whereRaw('`classes_schedule`.`classes_id` = `classes`.`id`')
            .whereRaw('`classes_schedule`.`week_day` = ??', [Number(week_day)])
            .whereRaw('`classes_schedule`.`from` <= ??', [timeMinutes])
            .whereRaw('`classes_schedule`.`to` > ??', [timeMinutes])
        })
        .where("classes.subject", "=", subject)
        .join("users", "classes.user_id", "=", "users.id")
        .select(["classes.*", "users.*"])

        res.json(classes);
    }
    async create(req: Request, res: Response){
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;
    
        var trx = await db.transaction();
        const insertUserIds = await trx("users").insert({
            name,
            avatar,
            whatsapp,
            bio,
        });
        try {
            const user_id = insertUserIds[0];
            const insertClassesIds = await trx("classes").insert({
                subject,
                cost,
                user_id
            });
            const classes_id = insertClassesIds[0];
            const classSchedule = schedule.map((item: ScheduleItem) => {
                return {
                    week_day: item.week_day,
                    from: converterTime(item.from),
                    to: converterTime(item.to),
                    classes_id
                }
            });
            await trx("classes_schedule").insert(classSchedule)
            await trx.commit();
            return res.status(201).send();
        } catch (error) {
            await trx.rollback();
    
            return res.status(400).json({
                error: "Unexpeceted error while creating new class",
            });
        }
    }
}