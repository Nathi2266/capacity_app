import { base44 } from '../api/base44Client'

export { base44 }

export const entities = {
  Employee: {
    list: () => base44.entities.Employee.list(),
    filter: (query) => base44.entities.Employee.filter(query),
    create: (payload) => base44.entities.Employee.create(payload),
    update: (id, payload) => base44.entities.Employee.update(id, payload),
  },
  Project: {
    list: () => base44.entities.Project.list(),
    filter: (query) => base44.entities.Project.filter(query),
    create: (payload) => base44.entities.Project.create(payload),
    update: (id, payload) => base44.entities.Project.update(id, payload),
  },
  Allocation: {
    list: () => base44.entities.Allocation.list(),
    filter: (query) => base44.entities.Allocation.filter(query),
    create: (payload) => base44.entities.Allocation.create(payload),
    update: (id, payload) => base44.entities.Allocation.update(id, payload),
  },
  Notification: {
    list: () => base44.entities.Notification.list(),
    filter: (query) => base44.entities.Notification.filter(query),
    update: (id, payload) => base44.entities.Notification.update(id, payload),
  },
}
