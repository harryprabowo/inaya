import axios from "axios";
import { authHeader, handleResponse, argsValidator, Prototype } from "~/_helpers";

const { throwIfMissing } = argsValidator

const fetchAllItems = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/items`,
            authHeader()
        );

        const { items } = await handleResponse(response);

        return items.map(item => new Prototype.Item(
            item.id,
            item.name,
            new Date(item.createdAt),
            new Date(item.updatedAt),
            item.description
        ))
    } catch (err) {
        throw handleResponse(err, true);
    }
}

const fetchItemByRequestLine = async (id = throwIfMissing()) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/items/requestline?req_id=${id}`,
            authHeader()
        );

        const { items } = await handleResponse(response)
        const item = items[0]

        return new Prototype.Item(
            item.ItemId,
            item.name,
            new Date(item.createdAt),
            new Date(item.updatedAt),
            item.description
        )
    } catch (err) {
        throw handleResponse(err, true);
    }
}

const createGlobalItem = async (name = throwIfMissing(), description) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/items/add`,
            { name, description },
            authHeader()
        )

        return await handleResponse(response)
    } catch (err) {
        throw handleResponse(err, true)
    }
}

const itemService = {
    fetchAllItems,
    fetchItemByRequestLine,
    createGlobalItem
};

export default itemService;
