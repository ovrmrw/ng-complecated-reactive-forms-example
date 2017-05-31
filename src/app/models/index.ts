export interface SelectModel {
  id: string;
  text: string;
}

export class PpApiSelect2GenericResultModel {
  status: number;
  data: GenericSelect2Model[];
}

export class GenericSelect2Model {
  id: string;
  type: string;
  icon: string;
  text: string;
  subText: string;
}
