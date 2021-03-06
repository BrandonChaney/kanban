import express from 'express'
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { taskService } from '../services/TaskService';
import { commentService } from '../services/CommentService';

export class TasksController extends BaseController {
  constructor() {
    super("api/tasks")
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      // .get('', this.getAll)
      //.get('/:id', this.getById)
      .get('/:id/comments', this.getCommentByTaskId)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }
  // async getAll(req, res, next) {
  //   try {
  //     let data = await taskService.getAll(req.userInfo.email)
  //     return res.send(data)
  //   }
  //   catch (err) { next(err) }
  // }
  // async getById(req, res, next) {
  //   try {
  //     let data = await taskService.getById(req.params.id);
  //     return res.send(data)
  //   } catch (error) { next(error) }
  // }
  async getCommentByTaskId(req, res, next) {
    try {
      let data = await commentService.find({ taskId: req.params.id })
      return res.send(data)
    } catch (error) { next(error) }
  }
  async create(req, res, next) {
    try {
      req.body.creatorEmail = req.userInfo.email
      let data = await taskService.create(req.body)
      return res.status(201).send(data)
    } catch (error) { next(error) }
  }
  async edit(req, res, next) {
    try {
      let update = { id: req.params.id, creatorEmail: req.userInfo.email, listId: req.body.listId }
      let data = await taskService.edit(update)
      return res.send(data)
    } catch (error) { next(error) }
  }
  async delete(req, res, next) {
    try {
      await taskService.delete(req.params.id, req.userInfo.email)
      return res.send("Successfully deleted")
    } catch (error) { next(error) }
  }
}