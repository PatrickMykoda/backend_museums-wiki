import { Injectable } from "@nestjs/common";

@Injectable()
export class Utils {

    checkDateFormatCorrect(dateString: string): boolean {
        var regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/g;
        return regex.test(dateString);
    }

    checkDateInPast(dateString: string): boolean {
        const today = new Date();
        const givenDate = new Date(dateString);
        return (givenDate < today) ? true : false;
    }
}