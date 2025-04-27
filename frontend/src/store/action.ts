import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { UserAuth, Offer, Comment, CommentAuth, FavoriteAuth, UserRegister, NewOffer, ListOffer } from '../types/types';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { Token } from '../utils';

import UserWithTokenDto from '../dto/user/user-with-token.dto';
import { adaptListOffersToClient, adaptLoginToClient } from '../utils/adapters/adaptersToClient';
import { adaptOfferToClient, adaptCommentsToClient } from '../utils/adapters/adaptersToClient';
import { adaptSignupToServer, adaptCreateOfferToServer, adaptEditOfferToServer, adaptCreateCommentToServer } from '../utils/adapters/adaptersToServer';
import OfferDto from '../dto/offer/offer.dto';
import CommentDto from '../dto/comment/comment.dto';
import UserDto from '../dto/user/user.dto';
import { ListItemOfferDto } from '../dto/offer/list-offer.dto';

type Extra = {
  api: AxiosInstance;
  history: History;
}

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offers/post-offer',
  EDIT_OFFER: 'offers/edit-offer',
  DELETE_OFFER: 'offers/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register'
};

export const fetchOffers = createAsyncThunk<ListOffer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ListItemOfferDto[]>(ApiRoute.Offers);

    return adaptListOffersToClient(data);
  });

export const fetchFavoriteOffers = createAsyncThunk<ListOffer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ListItemOfferDto[]>(`offers${ApiRoute.Favorite}`);

    return adaptListOffersToClient(data);
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDto>(`${ApiRoute.Offers}/${id}`);

      return adaptOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<void, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const payload = adaptCreateOfferToServer(newOffer);
    const { data } = await api.post<OfferDto>(ApiRoute.Offers, payload);
    history.push(`${AppRoute.Property}/${data.id}`);
  });

export const editOffer = createAsyncThunk<void, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const payload = adaptEditOfferToServer(offer);
    const { data } = await api.patch<OfferDto>(`${ApiRoute.Offers}/${offer.id}`, payload);
    history.push(`${AppRoute.Property}/${data.id}`);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<ListOffer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ListItemOfferDto[]>(`offers${ApiRoute.Premium}/${cityName}`);

    return adaptListOffersToClient(data);
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDto[]>(`offers/${id}${ApiRoute.Comments}`);

    return adaptCommentsToClient(data);
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<UserDto>(ApiRoute.Login);

      return data.email;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<UserWithTokenDto>(ApiRoute.Login, { email, password });
    const { user, token } = adaptLoginToClient(data);

    Token.save(token);
    history.push(AppRoute.Root);

    return user.email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async () => {

    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, isPro }, { extra }) => {
    const { api, history } = extra;
    const payload = adaptSignupToServer({ email, password, name, isPro });
    const { data } = await api.post<{ id: string }>(ApiRoute.Register, payload);
    if (avatar) {
      const payloadAvatar = new FormData();
      payloadAvatar.append('avatar', avatar);
      await api.post(`users/${data.id}${ApiRoute.Avatar}`, payloadAvatar, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment[], CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;
    const payload = adaptCreateCommentToServer({ comment, rating, id });
    const { data } = await api.post<CommentDto[]>(`${ApiRoute.Comments}`, payload);

    return adaptCommentsToClient(data);
  });

export const postFavorite = createAsyncThunk<Offer, FavoriteAuth, { extra: Extra }>(
  Action.POST_FAVORITE,
  async ({ id }, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.post<OfferDto>(`offers${ApiRoute.Favorite}/${id}`);
      return adaptOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        history.push(AppRoute.Login);
      }

      return Promise.reject(error);
    }
  });
