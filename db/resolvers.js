
const User = require('../models/users');
const Project = require('../models/Project');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
require('dotenv').config({ path: 'variables.env' });


const createToken = (user, secret, expiresIn) => {
    const { id, email, name } = user;

    return jwt.sign({ id, email, name }, secret, { expiresIn })
}

const resolvers = {
    Query: {
        getProjects: async (_, { }, ctx) => {
            const projects = await Project.find({ creator: ctx.user.id });

            return projects;
        },

        getTasks: async (_, {input}, ctx) => {
            const tasks = await Task.find({ creator: ctx.user.id }).where('project').equals(input.project);

            return tasks;
        }
    },
    Mutation: {
        createUser: async (_, { input }) => {
            const { name, email, password } = input;
            const existUser = await User.findOne({ email });
            console.log(existUser)

            if (existUser) {
                throw new Error('The user already exists')
            }

            try {
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);
                const newUser = new User(input);
                newUser.save();
                return "User created correctly"

            } catch (error) {
                console.log(error)
            }
        },
        authenticateUser: async (_, { input }) => {
            const { email, password } = input;

            const existUser = await User.findOne({ email });
            console.log(existUser)

            if (!existUser) {
                throw new Error('The user does not exist')
            }

            const correctPassword = await bcryptjs.compare(password, existUser.password);

            if (!correctPassword) {
                throw new Error('The password is incorrect')
            }

            return {
                token: createToken(existUser, "secret", '4hr')
            }

        },
        newProject: async (_, { input }, ctx) => {
            try {
                const project = new Project(input);
                project.creator = ctx.user.id;
                const result = await project.save();
                return result;

            } catch (error) {
                console.log(error)
            }
        },
        updateProject: async (_, { id, input }, ctx) => {
            try {
                let project = await Project.findById(id);

                if (!project) {
                    throw new Error('Project not found')
                }

                if (project.creator.toString() !== ctx.user.id) {
                    throw new Error('You do not have permissions to edit this project')
                }


                project = await Project.findOneAndUpdate({ _id: id }, input, { new: true });
                return project;

            } catch (error) {
                console.log(error)
            }
        },
        deleteProject: async (_, { id }, ctx) => {
            try {
                let project = await Project.findById(id);

                if (!project) {
                    throw new Error('Project not found')
                }

                if (project.creator.toString() !== ctx.user.id) {
                    throw new Error('You do not have permissions to edit this project')
                }

                await Project.findOneAndDelete({ _id: id });

                return "Project deleted"

            } catch (error) {
                console.log(error)
            }
        },
        newTask: async (_, { input }, ctx) => {
            try {
                const task = new Task(input);
                task.creator = ctx.user.id;
                const result = await task.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        updateTask: async (_, { id, input, state }, ctx) => {
            let task = await Task.findById(id);

            if (!task) {
                throw new Error('Task not found');
            }

            if (task.creator.toString() !== ctx.user.id) {
                throw new Error('You do not have permissions to edit this project');
            }

            input.state = state;

            task = await Task.findOneAndUpdate({ _id: id }, input, { new: true });

            return task;
        },
        deleteTask: async (_, { id }, ctx) => {
            let task = await Task.findById(id);

            if (!task) {
                throw new Error('Task not found');
            }

            if (task.creator.toString() !== ctx.user.id) {
                throw new Error('You do not have permissions to edit this project');
            }

            await Task.findOneAndDelete({ _id: id });

            return "Task deleted";
        }
    }
}

module.exports = resolvers;