class Helper {

    getStatus(param) {
        let status;
        console.log("PARAM", param);
        if (param === "true") {
            status = true;
        } else if (param === "false") {
            status = false;
        } else {
            status = null;
        }
        return status
    }
}



module.exports = new Helper();