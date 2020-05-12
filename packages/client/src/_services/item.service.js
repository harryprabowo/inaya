import {
  config,
  argsValidator,
  Prototype
} from "~/_helpers";

const { api } = config
const { throwIfMissing } = argsValidator

const fetchAllItems = async () => {
  const response = await api(true).get(`/items`);

  const { items } = response;

  return items.map(item => new Prototype.Item(
    item.id,
    item.name,
    new Date(item.createdAt),
    new Date(item.updatedAt),
    item.description
  ))
}

const fetchItemByRequestLine = async (id = throwIfMissing()) => {
  const response = await api(true).get(`/items/requestline?req_id=${id}`);

  const item = response.items[0]

  return new Prototype.Item(
    item.ItemId,
    item.name,
    new Date(item.createdAt),
    new Date(item.updatedAt),
    item.description
  )
}

const createGlobalItem = async (name = throwIfMissing(), description) => {
  return await api(true).post(
    `/items/add`,
    {
      name,
      description
    }
  )
}

const itemService = {
  fetchAllItems,
  fetchItemByRequestLine,
  createGlobalItem
};

export default itemService;
