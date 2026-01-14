const data = require('../config/env');
const {prisma} = require('../config/prisma');


class JobRepository {
    async findById(jobId)
    {
        return await prisma.jobs.findUnique(
            {
                where : {id : jobId},
                include : {}
            }
        )
    }
    
    async create(jobData)
    {
        if(!await this.findById(jobData.id))
        {
            return await prisma.jobs.create({
                data : jobData 
            })
        }
    }

    async update(jobId, updateData)
    {
        if (await this.findById(jobId))
        {
            return await prisma.jobs.update({
                where : {id : jobId},
                data: updateData,
                include : {

                }
            })
        }
        else 
            return new Error("job does not exists");
    }

    async delete (jobId)
    {
        if (await this.findById(jobId))
        {
            return await prisma.jobs.delete(jobId);
        }
        else
            return new Error("job does not exists");
    }

    async findMany(skip = 0, take = 10)
    {
        
    }
}

const jobRepository = new JobRepository();
module.exports = jobRepository;