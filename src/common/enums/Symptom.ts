enum Symptom {
  Head = 'Head',
  Face = 'Face',
  Neck = 'Neck',
  Chest = 'Chest',
  Abdomen = 'Abdomen',
  Pelvis = 'Pelvis',
  Arm = 'Arm',
  Leg = 'Leg',
  Other = 'Other',
}

export function symptomToRealName(symptom: Symptom): string {
  switch (symptom) {
    case Symptom.Head:
      return '머리';
    case Symptom.Face:
      return '얼굴';
    case Symptom.Neck:
      return '목';
    case Symptom.Chest:
      return '가슴';
    case Symptom.Abdomen:
      return '복부';
    case Symptom.Pelvis:
      return '골반';
    case Symptom.Arm:
      return '팔';
    case Symptom.Leg:
      return '다리';
    default:
    case Symptom.Other:
      return '모르겠음';
  }
}

export default Symptom;
