export type ISendEmail = {
  to: string;
  subject: string;
  html: string;
};

export type ISendLink = {
  to: string;
  userName: string;
  artistName: string;
  bookingDate: string;
  bookingTime: string;
  bookingLink: string;
};