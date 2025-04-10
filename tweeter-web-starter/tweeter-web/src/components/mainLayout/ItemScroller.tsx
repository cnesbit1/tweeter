import { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useToastListener from '../toaster/ToastListenerHook';
import useUserInfo from '../userInfo/UserInfoHook';
import {
  PagedItemPresenter,
  PagedItemView,
} from '../../presenters/mainLayout/PagedItemPresenter';

interface ItemScrollerProps<
  T,
  V extends PagedItemView<T>,
  P extends PagedItemPresenter<T, U>,
  U
> {
  presenterGenerator: (view: V) => P;
  ItemComponent: React.ComponentType<{ value: T }>;
}

const ItemScroller = <
  T,
  V extends PagedItemView<T>,
  P extends PagedItemPresenter<T, U>,
  U
>({
  presenterGenerator,
  ItemComponent,
}: ItemScrollerProps<T, V, P, U>) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<T[]>([]);
  const [newItems, setNewItems] = useState<T[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  const { displayedUser, authToken } = useUserInfo();

  // const [hasRerendered, setHasRerendered] = useState(false);

  // useEffect(() => {
  //   if (!hasRerendered) {
  //     setHasRerendered(true);
  //   }
  // }, []);

  // Reset when displayed user changes
  useEffect(() => {
    reset();
  }, [displayedUser]);

  // Load initial items when user changes
  useEffect(() => {
    if (changedDisplayedUser) {
      loadMoreItems();
    }
  }, [changedDisplayedUser]);

  // Append new items
  useEffect(() => {
    if (newItems.length) {
      setItems((prev) => [...prev, ...newItems]);
    }
  }, [newItems]);

  const reset = async () => {
    setItems([]);
    setNewItems([]);
    setChangedDisplayedUser(true);
    presenter.reset();
  };

  const listener: V = {
    addItems: (newItems: T[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage,
  } as V;

  const [presenter] = useState(presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    setChangedDisplayedUser(false);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <ItemComponent value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
