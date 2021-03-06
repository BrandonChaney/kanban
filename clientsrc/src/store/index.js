import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import api from './AxiosService';
import { BoardsStore } from "./BoardsStore"
import { ListsStore } from "./ListsStore"
import { TasksStore } from "./TasksStore"
import { CommentsStore } from "./CommentsStore"

Vue.use(Vuex)

//Allows axios to work locally or live


export default new Vuex.Store({
  state: {
    user: {},
    boards: [],
    activeBoard: {},
    lists: [],
    tasks: {},
    comments: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setBoards(state, boards) {
      state.boards = boards
    },
    setActiveBoard(state, activeBoard) {
      state.activeBoard = activeBoard
    },
    setLists(state, lists) {
      state.lists = lists
    },
    addList(state, list) {
      state.lists.push(list)
    },
    removeList(state, id) {
      state.lists = state.lists.filter(l => l.id != id)
    },

    setTasks(state, payload) {
      // REVIEW this wont work
      //state.tasks[payload.listId] = payload.tasks
      Vue.set(state.tasks, payload.listId, payload.tasks)
    },
    updateLists(state, lists) {
      state.lists = lists
    },
    addTask(state, payload) {

      state.tasks[payload.listId].push(payload)
    },
    removeTask(state, id) {
      state.tasks[id].delete(t => t.id != id)
    },
    addComment(state, payload) {

      state.comments[payload.taskId].push(payload)
    },
    setComments(state, payload) {
      Vue.set(state.comments, payload.taskId, payload.comments)
    }

  },


  actions: {
    //#region -- AUTH STUFF --
    setBearer({ }, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },
    async getProfile({ commit }) {
      try {
        let res = await api.get("/profile")
        commit("setUser", res.data)
      } catch (err) {
        console.error(err)
      }
    },

  },
  modules: {
    BoardsStore,
    ListsStore,
    TasksStore,
    CommentsStore
  }

})
