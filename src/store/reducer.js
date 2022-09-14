import { BOOK_PAGE_STATUS, FETCH_DOCTORS, FETCH_USER, FETCH_DOCTORS_BY_TOWN, CURRENT_USER, SIGN_OUT_USER } from "./actions";

const initialState = {
    bookStatus: false,
    doctors: [],
    townDoctors: [],
    currentUserDetails: {}
}
export const fetchCurrentUserReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_USER:
            return{
                ...state, currentUserDetails: action.user
            }
        case SIGN_OUT_USER:
            return{
                ...state, currentUserDetails: initialState.currentUserDetails
            }
        default:
            break;
    }
    return state
}
export const fetchDoctorsReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_DOCTORS:
            return {
                ...state, doctors: action.doctors
            }

        case FETCH_DOCTORS_BY_TOWN: 
            return {
                ...state, townDoctors: state.doctors.filter(doctor => doctor.town === action.search ) 
            }
        default:
            break;
    }
    return state
}

export const bookStatusReducer = (state=initialState, action) => {
    switch(action.type){
        case BOOK_PAGE_STATUS:
            return{
                ...state, bookStatus: action.bookStatus
            }
        default:
            break;
    }
    return state
}