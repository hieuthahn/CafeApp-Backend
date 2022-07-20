function toSlug(string) {
    // Chuyển hết sang chữ thường
    string = string.toLowerCase();

    // xóa dấu
    string = string.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    string = string.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    string = string.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    string = string.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    string = string.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    string = string.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    string = string.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    string = string.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    string = string.replace(/(\s+)/g, '-');

    // xóa phần dự - ở đầu
    string = string.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    string = string.replace(/-+$/g, '');

    // return
    return string;
}

function toLowerCaseTrim(string) {
    // Chuyển hết sang chữ thường
    string = string.toLowerCase();

    // xóa dấu
    string = string.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    string = string.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    string = string.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    string = string.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    string = string.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    string = string.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    string = string.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    string = string.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự
    string = string.replace(/(\s+)/g, '');

    // xóa phần dự - ở đầu
    string = string.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    string = string.replace(/-+$/g, '');

    // return
    return string;
}

module.exports = { toSlug, toLowerCaseTrim };
