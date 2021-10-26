import API from "./API.js";
import { CropPhotoInfo } from "./photos.js";
import { SingleOrArray } from "./utilitsTypes.js";

interface CareerInfo {
	group_id?: number;
	company?: string;
	country_id: number;
	city_id?: number;
	city_name?: string;
	from?: number;
	until?: number;
	position?: string;
}

interface CityInfo {
	id: number;
	title: string;
}

interface CountryInfo {
	id: number;
	title: string;
}

interface Counters {
	albums?: number;
	videos?: number;
	audios?: number;
	photos?: number;
	notes?: number;
	friends?: number;
	groups?: number;
	online_friends?: number;
	mutual_friends?: number;
	user_videos?: number;
	followers?: number;
	pages?: number;
	gifts?: number;
	subscriptions?: number;
	user_photos?: number;
	new_photo_tags?: number;
	new_recognition_tags?: number;
	articles?: number;
	clips_followers?: number;
}

interface LastOnline {
	time: number;
	platform: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}
interface MilitaryInfo {
	unit: string;
	unit_id: number;
	country_id: number;
	from?: number;
	until?: number;
}
interface OccupationInfo {
	type: "work" | "school" | "university";
	id: number;
	name: string;
}
enum Political {
	Communist = 1,
	Socialist = 2,
	Moderate = 3,
	Liberal = 4,
	Conservative = 5,
	Monarchical = 6,
	UltraConservative = 7,
	Indifferent = 8,
	Libertarian = 9
}
enum PeopleMain {
	None = 0,
	IntelligenceCreativity = 1,
	KindnessHonesty = 2,
	BeautyHealth = 3,
	PowerWealth = 4,
	CouragePerseverance = 5,
	HumorLoveOfLife = 6
}
enum LifeMain {
	None = 0,
	FamilyChildren = 1,
	CareerMoney = 2,
	EntertainmentRecreation = 3,
	ScienceResearch = 4,
	ImprovingWorld = 5,
	SelfDevelopment = 6,
	BeautyArt = 7,
	FameInfluence = 8
}
enum Relationship {
	None = 0,
	SharplyNegative = 1,
	Negative = 2,
	Compromise = 3,
	Neutral = 4,
	Positive = 5
}
interface PersonalInfo {
	political?: Political;
	langs?: string[];
	religion?: string;
	inspired_by: string;
	people_main: PeopleMain;
	life_main: LifeMain;

	smoking: Relationship;
	alcohol: Relationship;
}

interface Relative {
	id?: number;
	name: string;
	type: "child" | 'sibling' | "parent" | "grandparent" | "grandchild";
}
enum Relation {
	None = 0,
	Single = 1,
	HaveFriend = 2,
	Engaged = 3,
	Married = 4,
	EverythingIsComplicated = 5,
	ActiveSearch = 6,
	Love = 7,
	CivilMarriage = 8,
}

enum SchoolType {
	School = 0,
	Gymnasium = 1,
	Lyceum = 2,
	BoardingSchool = 3,
	EveningSchool = 4,
	MusicSchool = 5,
	SportsSchool = 6,
	ArtSchool = 7,
	College = 8,
	ProfessionalLyceum = 9,
	TechnicalSchool = 10,
	PTU = 11,
	College2 = 12,
	ArtSchool2 = 13
}
enum SchoolStrType {
	School = "школа",
	Gymnasium = "гимназия",
	Lyceum = "лицей",
	BoardingSchool = "школа-интернат",
	EveningSchool = "школа вечерняя",
	MusicSchool = "школа музыкальная",
	SportsSchool = "школа спортивная",
	ArtSchool = "школа художественная",
	College = "колледж",
	ProfessionalLyceum = "профессиональный лицей",
	TechnicalSchool = "техникум",
	PTU = "ПТУ",
	College2 = "училище",
	ArtSchool2 = "школа искусств"
}
interface SchoolInfo {
	id: number;
	country: number;
	city: number;
	name: string;
	year_from?: number;
	year_to?: number;
	year_graduated?: number;
	class?: string;
	speciality?: string;
	type: SchoolType;
	type_str: SchoolStrType;
}
enum Sex {
	None = 0,
	Female = 1,
	Male = 2
}

interface Audio {
	artist: string;
	id: number;
	owner_id: number;
	title: string;
	duration: number;
	is_explicit: boolean;
	is_focus_track: boolean;
	track_code: string;
	url: string;
	date: number;
	lyrics_id: number;
	genre_id: number;
	short_videos_allowed: boolean;
	stories_allowed: boolean;
	stories_cover_allowed: boolean;
}

interface University {
	id: number;
	country: number;
	city: number;
	name: string;
	faculty?: number;
	faculty_name?: string;
	chair?: number;
	chair_name?: string;
	graduation?: number;
	education_form?: string;
	education_status?: string;
}

interface UserObject {
	first_name: string;
	id: number;
	last_name: string;
	deactivated: "deleted" | "banned";
	can_access_closed: boolean;
	is_closed: boolean;

	about?: string;
	activities?: string;
	bdate?: string;
	blacklisted?: 0 | 1;
	blacklisted_by_me?: 0 | 1;
	books?: string;
	can_post?: 0 | 1;
	can_see_all_posts?: 0 | 1;
	can_see_audio?: 0 | 1;
	can_send_friend_request?: 0 | 1;
	can_write_private_message?: 0 | 1;
	career?: CareerInfo[];
	city?: CityInfo;
	common_count?: number;
	skype?: string;
	facebook?: string;
	twitter?: string;
	livejournal?: string;
	instagram?: string;
	mobile_phone?: string;
	home_phone?: string;
	counters?: Counters;
	country?: CountryInfo
	crop_photo?: CropPhotoInfo;
	domain?: string;
	university?: number;
	university_name?: string;
	faculty?: number;
	faculty_name?: string;
	graduation?: number;
	education_form?: string;
	exports?: any; // Что это блть?
	first_name_nom?: string;
	last_name_nom?: string;
	first_name_gen?: string;
	last_name_gen?: string;
	first_name_dat?: string;
	last_name_dat?: string;
	first_name_acc?: string;
	last_name_acc?: string;
	first_name_ins?: string;
	last_name_ins?: string;
	first_name_abl?: string;
	last_name_abl?: string;
	followers_count?: number;
	friend_status?: 0 | 1 | 2 | 3;
	games?: string;
	has_mobile?: 0 | 1;
	has_photo?: 0 | 1;
	home_town?: string;
	interests?: string;
	is_favorite?: 0 | 1;
	is_friend?: 0 | 1;
	is_hidden_from_feed?: 0 | 1;
	last_seen?: LastOnline;
	lists?: string;


	maiden_name?: string;
	military?: MilitaryInfo[];
	movies?: string;
	music?: string;
	nickname?: string;
	occupation?: OccupationInfo;
	online?: 0 | 1;
	personal: PersonalInfo;
	photo_50?: string;
	photo_100?: string;
	photo_200_orig?: string;
	photo_200?: string;
	photo_400_orig?: string;
	photo_id?: string;
	photo_max?: string;
	photo_max_orig?: string;
	quotes?: string;
	relatives?: Relative[];
	relation?: Relation;
	relation_partner?: {
		first_name: string;
		id: number;
		last_name: string;
	};
	schools?: SchoolInfo[];
	screen_name?: string;
	sex?: Sex;
	site?: string;
	status?: string;
	status_audio?: Audio;
	timezone?: number;
	trending?: 0 | 1;
	tv?: string;
	universities: University[];
	verified: 0 | 1;
	wall_default: "owner" | "all";
}

enum NameCase {
	NOM = "nom",
	GEN = "gen",
	DAT = "dat",
	ACC = "acc",
	INS = "ins",
	ABL = "abl"
}


class UsersAPI extends API {
	protected name: string = "users";

	public get(user_id: number, name_case?: NameCase, fields?: string[]): Promise<UserObject>;
	public get(user_ids: number[], name_case?: NameCase, fields?: string[]): Promise<UserObject[]>;

	public async get(users_ids: number | number[], name_case: NameCase = NameCase.NOM, fields?: string[]): Promise<SingleOrArray<UserObject>> {
		const is_array = Array.isArray(users_ids);

		const params: NodeJS.Dict<any> = {
			user_ids: is_array ? users_ids : [users_ids],
			name_case: name_case
		};
		if (fields) params["fields"] = fields;

		const res = await this.invokeMethod<UserObject[]>("get", params);

		return is_array ? res : res[0];
	}
}

export default UsersAPI;

export { UserObject };
