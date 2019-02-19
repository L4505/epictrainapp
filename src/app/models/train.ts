export class Train {

  cancelled: boolean;
  commuterLineID: string;
  departureDate: string;
  operatorShortCode: string;
  operatorUICCode: number;
  runningCurrently: boolean;
  timeTableRows: [
    {
      stationShortCode: string;
      stationUICCode: string;
      countryCode: string;
      type: string;
      trainStopping: boolean;
      commercialStop: boolean;
      commercialTrack: number;
      cancelled: boolean;
      scheduledTime: string;
      actualTime: string;
      differenceInMinutes: number;
      causes: [
        {
        categoryCodeId: string;
        categoryCode: string;
        detailedCategoryCodeId: string;
        detailedCategoryCode: string;
        thirdCategoryCodeId: string;
        thirdCategoryCode: string;
        }
      ],
      trainReady: [
        {
          source: string;
          accepted: string;
          timeStamp: string;
        }
      ]
    }
  ];
  timetableAcceptanceDate: string;
  timetableType: string;
  trainCategory: string;
  trainNumber: number;
  trainType: string;
  version: number;
  time: {};

}
