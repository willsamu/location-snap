export interface DataApiResponse {
  dbResponse: AWS.RDSDataService.ExecuteStatementResponse;
  error: string;
}

export interface SetPictureResponse {
  result: DataApiResponse;
  imageUrl: string;
}
