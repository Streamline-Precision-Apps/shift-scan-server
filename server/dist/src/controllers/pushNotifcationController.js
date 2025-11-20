
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="fcb14357-9923-59e3-bab7-2c7268606080")}catch(e){}}();
import * as PushNotificationService from "../services/pushNotificationServices.js";
/**
 * Controller for marking notifications as read.
 * Decides which service to call based on body params.
 */
export async function markReadController(req, res) {
    try {
        const { notificationId, markAll, brokenEquipment, userId } = req.body;
        let result;
        if (markAll) {
            result = await PushNotificationService.markAllNotificationsAsReadService(userId);
            return res.status(200).json({ success: true, ...result });
        }
        if (brokenEquipment && notificationId) {
            result =
                await PushNotificationService.markBrokenEquipmentNotificationsAsReadService(notificationId, userId);
            return res.status(200).json({ success: true, ...result });
        }
        if (notificationId) {
            result =
                await PushNotificationService.updateNotificationReadStatusService(notificationId, userId);
            return res.status(200).json({ success: true, ...result });
        }
        return res.status(400).json({ error: "Invalid parameters" });
    }
    catch (error) {
        console.error("Error in markReadController:", error);
        return res
            .status(500)
            .json({ error: "Failed to mark notification(s) as read" });
    }
}
//# sourceMappingURL=pushNotifcationController.js.map
//# debugId=fcb14357-9923-59e3-bab7-2c7268606080
