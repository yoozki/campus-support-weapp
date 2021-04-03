export default function(sexLimit) {
    if (sexLimit === 0) {
        return "不限男女"
    } else if (sexLimit === 1) {
        return "仅限男"
    } else if (sexLimit === 2) {
        return "仅限女"
    }
}