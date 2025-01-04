import mongoose, { Schema, Document } from 'mongoose';
import UserModel from './User';
// Interface for Conference document
export interface IConference extends Document {
  conferenceOrganizer: mongoose.Types.ObjectId;
  conferenceOrganizerWebPage: string;
  conferenceOrganizerPhoneNumber: number;
  conferenceOrganizerRole: string;
  conferenceTitle: string;
  conferenceEmail:string,
  conferenceAnyOtherInformation: string;
  // conferenceSubmittedPapers: mongoose.Types.ObjectId[];
  conferenceAcronym: string;
  conferenceWebpage: string;
  conferenceVenue: string;
  conferenceCity: string;
  conferenceCountry: string;
  conferenceEstimatedNumberOfSubmissions:number,
  conferenceFirstDay: Date;
  conferenceLastDay: Date;
  conferencePrimaryArea: string;
  conferenceSecondaryArea: string;
  conferenceAreaNotes:string,
  conferenceCreatedAt: Date;
  // conferenceDescription: string;
  conferenceIsAcceptingPaper: boolean;
  conferenceStatus: string;
  conferenceStatusComment:{ comment: string; updatedAt: Date }[];
  conferenceSubmissionsDeadlineDate:Date;
  conferenceSecurityDeposit2000Paid:boolean
}

// Conference schema definition
const ConferenceSchema: Schema<IConference> = new Schema({
  conferenceOrganizer: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
  conferenceOrganizerWebPage: { type: String},
  conferenceOrganizerPhoneNumber: { type: Number, required: true },
  conferenceOrganizerRole: { type: String, required: true },
  conferenceTitle: { type: String, required: true },
  conferenceEmail:{type:String,required:true},
  conferenceAnyOtherInformation: { type: String, required: false },
  // conferenceSubmittedPapers: [{ type: Schema.Types.ObjectId, ref: 'Paper' }],
  conferenceAcronym: { type: String, required: true },
  conferenceWebpage: { type: String, required: true },
  conferenceVenue: { type: String, required: true },
  conferenceCity: { type: String, required: true },
  conferenceCountry: { type: String, required: true },
  conferenceEstimatedNumberOfSubmissions:{type:Number},
  conferenceFirstDay: { type: Date },
  conferenceLastDay: { type: Date, required: true },
  conferencePrimaryArea: { type: String },
  conferenceSecondaryArea: { type: String },
  conferenceAreaNotes:{type:String,length:500},
  conferenceCreatedAt: { type: Date, required: true, default: Date.now },
  conferenceIsAcceptingPaper: { type: Boolean, default: true },
  conferenceStatus: { type: String, required: true,enum:["submitted","accepted","rejected","review"],default:"submitted" },
  conferenceStatusComment:[
    {
      comment: String,
      updatedAt: { type: Date, default: Date.now },
    }
  ],
  conferenceSubmissionsDeadlineDate:{type:Date,required:true},
  conferenceSecurityDeposit2000Paid:{type:Boolean,default:false}
});

// Conference model
const ConferenceModel = (mongoose.models.Conference as mongoose.Model<IConference>) || mongoose.model<IConference>('Conference', ConferenceSchema);

export default ConferenceModel;