import axios from "axios"
import Cookie from "js-cookie"
import { isNullOrUndefined } from "util"
import { authHeader, handleResponse, Prototype, argsValidator } from "~/_helpers";

const { throwIfMissing } = argsValidator

const fetchMyDroppoints = async () => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/droppoint/user`,
            authHeader()
        );

        const droppoints = await handleResponse(response);

        return droppoints.map(droppoint => new Prototype.Droppoint(
            droppoint.id,
            `Point #${droppoint.id}`, // TODO: Implement name
            new Prototype.Position(
                parseFloat(droppoint.longitude),
                parseFloat(droppoint.latitude)
            ),
            new Date(droppoint.createdAt),
            new Date(droppoint.updatedAt),
            // isNullOrUndefined(droppoint.image)
            //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
            //     : droppoint.image  // TODO: Implement image
        ))

    } catch (err) {
        throw handleResponse(err, true);
    }
}

const register = async (latitude = throwIfMissing(), longitude = throwIfMissing()) => {
    try {
        const userId = JSON.parse(Cookie.get("user"))["id"]

        if (isNullOrUndefined(userId)) throw new Error("User ID not available")

        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/droppoint/create`,
            { userId, longitude, latitude },
            authHeader()
        )

        return await handleResponse(response)
    } catch (err) {
        throw handleResponse(err, true)
    }
}

const getDroppointByShipment = async (id = throwIfMissing()) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/droppoint?delivery_id=${id}`,
            authHeader()
        );

        const { droppoints } = await handleResponse(response);
        const droppoint = droppoints[0]

        return new Prototype.Droppoint(
            droppoint.id,
            `Point #${droppoint.id}`, // TODO: Implement name
            new Prototype.Position(
                parseFloat(droppoint.longitude),
                parseFloat(droppoint.latitude)
            ),
            new Date(droppoint.createdAt),
            new Date(droppoint.updatedAt),
            // isNullOrUndefined(droppoint.image)
            //     ? "https://www.supplychaindigital.com/sites/default/files/styles/slider_detail/public/topic/image/GettyImages-1125121546_0.jpg?itok=VInTwcQ5"
            //     : droppoint.image  // TODO: Implement image
        )
    } catch (err) {
        throw handleResponse(err, true);
    }
}

const droppointService = {
    fetchMyDroppoints,
    register,
    getDroppointByShipment
}

export default droppointService