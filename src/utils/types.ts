
interface ListResponse<T = any> {
	count: number;
	items: T[];
}
type SingleOrArray<T> = T | T[];

export { ListResponse, SingleOrArray };
