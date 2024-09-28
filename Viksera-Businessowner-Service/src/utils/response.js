class Response {

    constructor(status, msg, data = null, pagination = null) {
        this.status = status;
        this.msg = msg;
        this.data = data;
        this.pagination = pagination;
    }

    static success(data, msg = 'Request was successful', pagination = null) {
        return new Response('OK', msg, data, pagination);
    }

    static error(msg, data = null) {
        return new Response('FAILED', msg, data);
    }
}

module.exports = Response;
