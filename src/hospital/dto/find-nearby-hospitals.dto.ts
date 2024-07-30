import { IsNumber } from 'class-validator';
import HospitalEntity from '../entities/hospital.entity';
import ILatLon from '../../common/types/ILatLon';
import haversineDistance from '../../common/utils/HaversineDistance';

export class FindNearbyHospitalsDto extends HospitalEntity {
  @IsNumber()
  distance: number;

  static fromHospital(currentPos: ILatLon, hospital: any) {
    const obj = new FindNearbyHospitalsDto();
    obj.id = hospital.id;
    obj.institutionName = hospital.institution_name;
    obj.institutionType = hospital.institution_type;
    obj.medicalDepartment = hospital.medical_department;
    obj.medicalDepartmentDoctorCount = hospital.medical_department_doctor_count;
    obj.homepage = hospital.homepage;
    obj.address = hospital.address;
    obj.tel = hospital.tel;
    obj.latitude = hospital.latitude;
    obj.longitude = hospital.longitude;
    obj.createdAt = hospital.created_at;
    obj.distance = haversineDistance(currentPos, {
      latitude: hospital.latitude,
      longitude: hospital.longitude,
    });
    return obj;
  }
}
