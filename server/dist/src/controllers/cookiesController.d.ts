import express from "express";
export declare function getCookie(req: express.Request, res: express.Response): express.Response<any, Record<string, any>> | undefined;
export declare function getCookieList(req: express.Request, res: express.Response): express.Response<any, Record<string, any>> | undefined;
export declare function setCookie(req: express.Request, res: express.Response): express.Response<any, Record<string, any>> | undefined;
export declare function deleteCookie(req: express.Request, res: express.Response): express.Response<any, Record<string, any>> | undefined;
export declare function deleteAllCookie(req: express.Request, res: express.Response): void;
export declare function deleteCookieList(req: express.Request, res: express.Response): express.Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=cookiesController.d.ts.map