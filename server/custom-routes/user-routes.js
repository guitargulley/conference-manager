let Events = require('../models/event')
let Activities = require('../models/activity')
let Notes = require('../models/note')
let Users = require('../models/user')

module.exports = {
  getUserNotes: {
    path: '/user-notes',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Find User Notes'
      Notes.find({ creatorId: req.session.uid })
        .then(notes => {
          res.send(handleResponse(action, notes))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  getUserEvents: {
    path: '/user-events',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Find User Events'
      Users.find({ _id: req.session.uid })
        .then(user => {
          Events.find({ _id: { $in: user[0].events } })
            .then(events => {
              res.send(handleResponse(action, events))
            })
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  getUserActivities: {
    path: '/user-activities',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Find User Activities'
      Users.find({ _id: req.session.uid })
        .then(user => {
          Activities.find({ _id: { $in: user[0].activities } })
            .then(activities => {
              res.send(handleResponse(action, activities))
            })
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  getUserActivitiesByEventId: {
    path: '/user-events/:eventId/activities',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Find User Activities by Event Id'
      Users.find({ _id: req.session.uid })
        .then(user => {
          Activities.find({ _id: { $in: user[0].activities }, eventId: req.params.eventId })
            .then(activities => {
              res.send(handleResponse(action, activities))
            })
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  editUserEvents: {
    path: '/user-events',
    reqType: 'put',
    method(req, res, next) {
      let action = 'Edit User Events'
      Users.findOneAndUpdate({ _id: req.session.uid }, req.body)
        .then(user => {
          return res.send(handleResponse(action, { message: 'Successfully updated user events.' }))
        })
        .catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  removeEventFromUserSchedule: {
    path: '/user-events/:eventId',
    reqType: 'put',
    method(req, res, next) {
      let action = 'Remove User Event'
      Users.find({ _id: req.session.uid })
        .then(users => {
          var user = users[0]
          Events.find({ _id: {$in: user.events } })
            .then(events => {
              var updatedEventIds = []
              for (var i = 0; i < events.length; i++) {
                if (!(events[i]._id == req.params.eventId)) {
                  updatedEventIds.push(events[i]._id)
                }
              }
              user.events = updatedEventIds
              Activities.find({ _id: {$in: user.activities}})
                .then(activities => {
                  var updatedActivityIds = []
                  for (var i = 0; i < activities.length; i++) {
                    if (activities[i].eventId != req.params.eventId) {
                      updatedActivityIds.push(activities[i]._id)
                    } else {
                      if (activities[i].capacity >= 0) {
                        activities[i].capacity++
                        activities[i].save()
                      }
                    }
                  }
                  user.activities = updatedActivityIds
                  user.save()
                  return res.send(handleResponse(action, { message: 'Successfully updated user events.' }))
                })
                .catch(error => {
                  return next(handleResponse(action, null, error))
                })
            }).catch(error => {
              return next(handleResponse(action, null, error))
            })
        })
        .catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  editUserActivities: {
    path: '/user-activities',
    reqType: 'put',
    method(req, res, next) {
      let action = 'Edit User Activities'
      Users.findOneAndUpdate({ _id: req.session.uid }, req.body)
        .then(data => {
          return res.send(handleResponse(action, { message: 'Successfully updated user activities.' }))
        })
        .catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  getAdminEvents: {
    path: '/admin-events',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Find Events Created By Admin'
      Events.find({ creatorId: req.session.uid })
        .then(events => {
          res.send(handleResponse(action, events))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  getAdminEvent: {
    path: '/admin-events/:eventId',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Find Event Created By Admin at Specific Id'
      Events.find({ _id: req.params.eventId, creatorId: req.session.uid })
        .then(events => {
          res.send(handleResponse(action, events[0]))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  deleteAdminEvent: {
    path: '/admin-events/:eventId',
    reqType: 'delete',
    method(req, res, next) {
      let action = 'Delete Event Created By Admin'
      var eventData = { "error": "Event data not set." }
      Events.findOneAndRemove({ _id: req.params.eventId, creatorId: req.session.uid })
        .then(event => {
          var eventData = event
          Notes.find({ _id: req.params.eventId })
            .then(notes => {
              for (var i = 0; i < notes.length; i++) {
                var note = notes[i]
                note.eventId = null
                delete note.eventId
                note.update()
              }
            }).then(() => {
              res.send(handleResponse(action, eventData))
            })
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

  adminActivities: {
    path: '/admin-activities',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Find Activities Created By Admin'
      Activities.find({ creatorId: req.session.uid })
        .then(activities => {
          res.send(handleResponse(action, activities))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  }
}

function handleResponse(action, data, error) {
  var response = {
    action: action,
    data: data
  }
  if (error) {
    response.error = error
  }
  return response
}