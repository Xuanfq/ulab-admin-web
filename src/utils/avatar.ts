import avatar from "../assets/avatar.png";

export function getDefaultAvatar(): string {
    return avatar;
}

/**
 * 将名字转为头像
 * @param name 名字
 * @param size 头像尺寸[width, height]
 * @returns 
 */
export function getNameAvatar(name: string, size: number[] = [200, 200]): string {
    const randomChar = () => {
        // 生成随机的ASCII码（a-z, A-Z, 0-9）
        const randomNum = Math.floor(Math.random() * 62);
        if (randomNum < 26) {
            return String.fromCharCode(randomNum + 97); // a-z
        } else if (randomNum < 52) {
            return String.fromCharCode(randomNum + 65 - 26); // A-Z
        } else {
            return String.fromCharCode(randomNum + 48 - 52); // 0-9
        }
    };
    const tranColor = (name: string) => {
        while (name.length < 4) {
            name += randomChar();
        }
        var str = '';
        for (var i = 0; i < name.length; i++) {
            str += parseInt(name[i].charCodeAt(0), 10).toString(16);
        }
        return '#' + str.slice(1, 4);
    }
    let colors = [
        "rgb(239,150,26)", 'rgb(255,58,201)', "rgb(111,75,255)", "rgb(36,174,34)", "rgb(80,80,80)"
    ];
    let firstName = name.substring(1, 0).toUpperCase();
    let bgColor = tranColor(name);
    // let bgColor=colors[Math.floor(Math.random()*(colors.length))];
    let cvs = document.createElement("canvas");
    cvs.setAttribute('width', size[0].toString());
    cvs.setAttribute('height', size[1].toString());
    let ctx = cvs.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size[0], size[1]);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.font = " bold " + size[0] * 0.6 + "px Arial,sans-serif";
    const metrics = ctx.measureText('M');
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(firstName, size[0] / 2, size[1] / 2 * 1.1);
    // ctx.fillText(firstName, size[0] / 2, size[1] / 2 + metrics.width / 2);

    return cvs.toDataURL('image/jpeg', 1);
}
